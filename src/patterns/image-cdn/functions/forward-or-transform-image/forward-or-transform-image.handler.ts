import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {ImageTransformer} from './image-transformer.types'
import {CloudFrontResponseEvent, CloudFrontResponseResult} from 'aws-lambda'
import {parse} from 'querystring'
import {Format, IMAGE_API_PARAMS} from '../image-api.types'
import {isString} from 'lodash'
import {parseDimensionValue} from '../common/dimension'

export const processEvent = async (
  s3: S3Client,
  imageTransformer: ImageTransformer,
  event: CloudFrontResponseEvent,
): Promise<CloudFrontResponseResult> => {
  const {
    cf: {
      request: {querystring, uri},
      response,
      response: {status},
    },
  } = event.Records[0]

  console.debug('got event !', JSON.stringify(event))

  const bucketName = getOriginBucketName(event)
  // non s3 origin, nothing to do
  if (!bucketName) {
    console.warn('could not find s3 bucket name, returning...')
    return response
  }

  // image was found or any other error, nothing to do
  if (!['403', '404'].includes(status)) {
    return response
  }

  const queryParams = parse(querystring)
  const sourceImage = queryParams[IMAGE_API_PARAMS.SRC_IMAGE] as string
  const nextExtension = queryParams[IMAGE_API_PARAMS.EXTENSION] as string
  const w = queryParams[IMAGE_API_PARAMS.WIDTH]
  const h = queryParams[IMAGE_API_PARAMS.HEIGHT]
  const fmt = queryParams[IMAGE_API_PARAMS.FORMAT]

  if (!isString(sourceImage)) {
    console.warn('source image is not a string, returning', sourceImage)
    return response
  }
  const sourceKey = sourceImage.replace(/^\//, '')
  const width = parseDimensionValue(w)
  const height = parseDimensionValue(h)
  const format = parseFormat(fmt)

  if (!width && !height && !format) {
    return response
  }
  try {
    const contentType = mimeType(nextExtension)
    const key = uri.replace(/^\//, '')

    console.debug(`Querying source image: ${sourceKey} in bucket ${bucketName}`)
    const command = new GetObjectCommand({Bucket: bucketName, Key: sourceKey})
    const imageObj = await s3.send(command)
    const data = await imageObj.Body?.transformToByteArray()
    if (!data) {
      console.warn('Could not get object data', imageObj.Body)
      return response
    }
    const resizedImage = await imageTransformer.transform(
      Buffer.from(data),
      {width, format, height},
      {withoutEnlargement: true},
    )

    // TODO: set cache control on original image, and use it here
    const cacheControl = 'max-age=31536000,public,immutable'
    await s3.send(
      new PutObjectCommand({
        Body: resizedImage,
        Bucket: bucketName,
        ContentType: contentType,
        Key: key,
        StorageClass: 'STANDARD',
        CacheControl: cacheControl,
      }),
    )

    return {
      ...response,
      status: '200',
      statusDescription: 'Found',
      body: resizedImage.toString('base64'),
      bodyEncoding: 'base64',
      headers: {
        ...response.headers,
        'content-type': [{key: 'Content-Type', value: contentType}],
        'cache-control': [{key: 'Cache-Control', value: cacheControl}],
      },
    }
  } catch (error: unknown) {
    const errorMessage = `Error while getting source image object "${sourceKey}": ${error}`
    console.error('Error caught', error)

    return {
      ...response,
      status: '404',
      statusDescription: 'Not Found',
      body: errorMessage,
      bodyEncoding: 'text',
      headers: {
        ...response.headers,
        'content-type': [{key: 'Content-Type', value: 'text/plain'}],
      },
    }
  }
}

function getOriginBucketName(event: CloudFrontResponseEvent): string | undefined {
  const {
    cf: {
      request: {origin},
    },
  } = event.Records[0]
  if (origin?.s3) {
    const domainName = origin.s3.domainName
    return parseS3BucketName(domainName)
  } else if (origin?.custom) {
    const domainName = origin.custom.domainName
    if (!domainName) {
      console.warn('could not find custom origin domain name, returning ...')
      return undefined
    } else if (!domainName.includes('s3-website')) {
      console.warn('custom origin is not an s3-website (unsupported), returning ...')
      return undefined
    } else {
      return parseS3BucketName(domainName)
    }
  } else {
    return undefined
  }
}

export function parseS3BucketName(domainName: string): string | undefined {
  const bucketNameRegex = /[^/]+(?=.(?:s3|s3-website)\.(?:[a-z0-9-]+)\.amazonaws\.com)/i
  const matches = domainName.match(bucketNameRegex)
  if (matches?.length) {
    return matches[0]
  } else {
    return undefined
  }
}

function parseFormat(fmt?: unknown): Format | undefined {
  if (!isString(fmt)) {
    return undefined
  }
  switch (fmt) {
    case 'jpeg':
      return Format.JPG
    case 'png':
      return Format.PNG
    case 'avif':
      return Format.AVIF
    case 'webp':
      return Format.WEBP
    default:
      return undefined
  }
}

function mimeType(extension: string): string {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'avif':
      return 'image/avif'
    case 'webp':
      return 'image/webp'
    case 'png':
      return 'image/png'
    default:
      console.warn(`Could not determine mime type for extension: '${extension}'`)
      return ''
  }
}
