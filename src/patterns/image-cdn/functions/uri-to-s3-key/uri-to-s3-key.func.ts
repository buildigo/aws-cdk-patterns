import {CloudFrontHeaders, CloudFrontRequest, CloudFrontRequestEvent, Handler} from 'aws-lambda'
import {parse, stringify} from 'querystring'
import {isNumber, isString, omit} from 'lodash'
import {IMAGE_API_PARAMS} from '../image-api.types'
import {mediaType} from '@hapi/accept'
import {parseDimensionValue} from '../common/dimension'
import {parseFormatValue} from '../common/format'

const BAD_JPG_EXTENSION = 'jpg'
const GOOD_JPG_EXTENSION = 'jpeg'
const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif']

export const handler: Handler<CloudFrontRequestEvent, CloudFrontRequest> = event => {
  const {
    request,
    request: {querystring, uri, headers},
  } = event.Records[0].cf
  console.debug('got event !', JSON.stringify(event))

  try {
    const queryParams = parse(querystring)
    const h = parseDimensionValue(queryParams[IMAGE_API_PARAMS.HEIGHT])
    const w = parseDimensionValue(queryParams[IMAGE_API_PARAMS.WIDTH])
    const fmt = parseFormatValue(queryParams[IMAGE_API_PARAMS.FORMAT]) || autoFormat(headers)

    if (!isNumber(h) && !isNumber(w) && !isString(fmt)) {
      // no parameter provided, skip any sort of transformation
      console.debug('No parameters found, skipping transform')
      return Promise.resolve(request)
    }

    // destructure URI to get prefix, imageName and extension
    const uriComponents = uri.match(/(.*)\/(.*)\.(\w*)/)
    if (!uriComponents || uriComponents.length < 3) {
      console.debug(`Could not destructure URI of ${uri}, found ${uriComponents?.length} items`)
      return Promise.resolve(request)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, prefix, imageName, prevExtension] = uriComponents

    // only transform supported extensions
    if (!SUPPORTED_EXTENSIONS.includes(prevExtension.trim().toLowerCase())) {
      console.debug(`Unsupported extension "${prevExtension}", skipping transform`)
      return Promise.resolve(request)
    }

    // new extension is the format parameter, if defined
    // fmt matches the target extensions (for now)
    let newExtension = fmt || prevExtension
    // normalize jpg extension
    if (newExtension === BAD_JPG_EXTENSION) {
      newExtension = GOOD_JPG_EXTENSION
    }

    // transform URI to include parameters and create a unique name reflecting the parameters
    request.uri = `${prefix}/${imageName}_${w || ''}x${h || ''}.${newExtension}`

    // adapt query strings
    const updatedQueryParams = {
      // remove the format, height and width parameters as they're validated above and we don't want to carry over falsy values
      ...omit(queryParams, [IMAGE_API_PARAMS.FORMAT, IMAGE_API_PARAMS.HEIGHT, IMAGE_API_PARAMS.WIDTH]),
      ...(w ? {[IMAGE_API_PARAMS.WIDTH]: w.toFixed(0)} : {}),
      ...(h ? {[IMAGE_API_PARAMS.HEIGHT]: h.toFixed(0)} : {}),
      ...(fmt ? {[IMAGE_API_PARAMS.FORMAT]: fmt} : {}),
      [IMAGE_API_PARAMS.SRC_IMAGE]: `${prefix}/${imageName}.${prevExtension}`,
      [IMAGE_API_PARAMS.EXTENSION]: newExtension,
    }
    request.querystring = stringify(updatedQueryParams)

    return Promise.resolve(request)
  } catch (err) {
    console.error(err)
    return Promise.resolve(request)
  }
}

function autoFormat(headers: CloudFrontHeaders) {
  const accept = Array.isArray(headers.accept) && headers.accept.length ? headers.accept[0].value : ''
  const possibleOptimizedContentTypes = ['image/avif', 'image/webp']
  const mimeType = mediaType(accept, possibleOptimizedContentTypes)
  if (accept.includes(mimeType)) {
    return mimeType.split('/')[1]
  } else {
    return undefined
  }
}
