import {parseS3BucketName, processEvent as ForwardOrTransformImage} from './forward-or-transform-image.handler'
import {CloudFrontResponseEvent} from 'aws-lambda'
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {ImageTransformer} from './image-transformer.types'
import {Format} from '../image-api.types'
import {sdkStreamMixin} from '@aws-sdk/util-stream-node'
import {Readable} from 'stream'
import {mockS3Client} from '../../../../../test/s3.mock'

describe('ForwardOrTransformImage', () => {
  beforeEach(() => {
    mockS3Responses()
  })
  it('should return the resized image if it already exists', async () => {
    const response = await ForwardOrTransformImage(new S3Client({}), mockImageTransformer(), mock200Event())
    expect(response!.status).toBe('200')
    expect(response).toMatchSnapshot()
  })

  it('should resize the image when it does not exist yet (403), but the source image does exist', async () => {
    const response = await ForwardOrTransformImage(new S3Client({}), mockImageTransformer(), mock403Event())
    expect(response!.status).toBe('200')
    expect(response!.headers!['content-type'][0].value).toBe('image/webp')
    expect(response).toMatchSnapshot()
  })

  it('should resize the image when it does not exist (404), but the source image does exist', async () => {
    const response = await ForwardOrTransformImage(new S3Client({}), mockImageTransformer(), mock404Event())
    expect(response!.status).toBe('200')
    expect(response!.headers!['content-type'][0].value).toBe('image/webp')
    expect(response).toMatchSnapshot()
  })

  it('should return 404 when source image does not exist', async () => {
    const response = await ForwardOrTransformImage(new S3Client({}), mockImageTransformer(), mockBadKeyEvent())
    expect(response).toMatchSnapshot()
  })

  it('should support events from a bucket with static website enabled (custom origin)', async () => {
    const response = await ForwardOrTransformImage(
      new S3Client({}),
      mockImageTransformer(),
      mockStaticWebsite404Event(),
    )
    expect(response!.status).toBe('200')
    expect(response!.headers!['content-type'][0].value).toBe('image/avif')

    expect(response).toMatchSnapshot()
  })
})

describe('parseS3BucketName', () => {
  const tests: [string, string | undefined][] = [
    ['https://image-test-yeah.s3-website.eu-central-1.amazonaws.com', 'image-test-yeah'],
    ['https://image-test-images.s3.eu-central-1.amazonaws.com', 'image-test-images'],
    ['https://image-test-images-xxx.s3.us-east-1.amazonaws.com', 'image-test-images-xxx'],
    ['image-test-images-xxx.s3.us-east-1.amazonaws.com', 'image-test-images-xxx'],
    ['abcd.image-test-images-xxx.us-east-1.amazonaws.com', undefined],
    ['test.com', undefined],
  ]

  for (const test of tests) {
    const [url, bucketName] = test
    it(`matches the bucket name "${bucketName}" from "${url}"`, () => {
      expect(parseS3BucketName(url)).toEqual(bucketName)
    })
  }
})

const mock200Event = (
  uri = 'good-image.png',
  querystring = 'ext=webp&fmt=webp&height=400&sourceImage=/good-image.png&width=700',
): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'origin-response',
          requestId: 'ZglsXKNU9HC_gwfO1qhXqGh_AipNOvr73VwCe0CTN3-Guu-b1C5MEw==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            'x-forwarded-for': [
              {
                key: 'X-Forwarded-For',
                value: '108.41.158.64',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Amazon CloudFront',
              },
            ],
            via: [
              {
                key: 'Via',
                value: '1.1 bcf69805bd7618b134f85cb9528fba32.cloudfront.net (CloudFront)',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'image-test-images.s3.amazonaws.com',
              },
            ],
            'cache-control': [
              {
                key: 'Cache-Control',
                value: 'max-age=0',
              },
            ],
          },
          method: 'GET',
          origin: {
            s3: {
              authMethod: 'origin-access-identity',
              customHeaders: {},
              domainName: 'image-test-images.s3.eu-central-1.amazonaws.com',
              path: '',
              region: 'eu-central-1',
            },
          },
          querystring,
          uri,
        },
        response: {
          headers: {
            'x-amz-id-2': [
              {
                key: 'x-amz-id-2',
                value: '8q8ejgujau4YCUdFL3Ck1VPB6PsiEr/60RIZPUDxgOuzM/t/Dueg5SG1RdbKxnFKN7u+Yt8QkiI=',
              },
            ],
            'x-amz-request-id': [
              {
                key: 'x-amz-request-id',
                value: '37THKNX0N2ADYKS3',
              },
            ],
            date: [
              {
                key: 'Date',
                value: 'Sat, 08 May 2021 23:36:25 GMT',
              },
            ],
            'last-modified': [
              {
                key: 'Last-Modified',
                value: 'Sat, 08 May 2021 23:33:28 GMT',
              },
            ],
            etag: [
              {
                key: 'ETag',
                value: '"72a9ff667c12b7d156a696877fc4df89"',
              },
            ],
            'accept-ranges': [
              {
                key: 'Accept-Ranges',
                value: 'bytes',
              },
            ],
            server: [
              {
                key: 'Server',
                value: 'AmazonS3',
              },
            ],
            'content-type': [
              {
                key: 'Content-Type',
                value: 'image/webp',
              },
            ],
            'content-length': [
              {
                key: 'Content-Length',
                value: '2832',
              },
            ],
          },
          status: '200',
          statusDescription: 'OK',
        },
      },
    },
  ],
})

const mock403Event = (
  uri = 'good-image.png',
  querystring = 'ext=webp&fmt=webp&height=400&sourceImage=/good-image.png&width=700',
): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'origin-response',
          requestId: '6bog7lAuZZ6TdQmXtL9RuwBqgvRN9Ok2ehhJbJ_jTkQOY1mRt3WIrQ==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            'x-forwarded-for': [
              {
                key: 'X-Forwarded-For',
                value: '108.41.158.64',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Amazon CloudFront',
              },
            ],
            via: [
              {
                key: 'Via',
                value: '1.1 bcf69805bd7618b134f85cb9528fba32.cloudfront.net (CloudFront)',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'image-test-images.s3.amazonaws.com',
              },
            ],
            'cache-control': [
              {
                key: 'Cache-Control',
                value: 'max-age=0',
              },
            ],
          },
          method: 'GET',
          origin: {
            s3: {
              authMethod: 'origin-access-identity',
              customHeaders: {},
              domainName: 'image-test-images.s3.eu-central-1.amazonaws.com',
              path: '',
              region: 'eu-central-1',
            },
          },
          querystring,
          uri,
        },
        response: {
          headers: {
            'x-amz-request-id': [
              {
                key: 'x-amz-request-id',
                value: 'XPWJPWV1KP5CFDTS',
              },
            ],
            'x-amz-id-2': [
              {
                key: 'x-amz-id-2',
                value: 'QZlgZ/jWFGkc/pjNjijOkI1KjEH7avdgXL/2r5kuD7xMWFs6K3CSnHycKhzcVrN1chM0Hkq+IQM=',
              },
            ],
            date: [
              {
                key: 'Date',
                value: 'Sat, 08 May 2021 23:33:25 GMT',
              },
            ],
            server: [
              {
                key: 'Server',
                value: 'AmazonS3',
              },
            ],
            'content-type': [
              {
                key: 'Content-Type',
                value: 'application/xml',
              },
            ],
            'transfer-encoding': [
              {
                key: 'Transfer-Encoding',
                value: 'chunked',
              },
            ],
          },
          status: '403',
          statusDescription: 'Forbidden',
        },
      },
    },
  ],
})

const mock404Event = (
  uri = 'good-image.png',
  querystring = 'ext=webp&fmt=webp&height=400&sourceImage=/good-image.png&width=700',
): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'origin-response',
          requestId: '6bog7lAuZZ6TdQmXtL9RuwBqgvRN9Ok2ehhJbJ_jTkQOY1mRt3WIrQ==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            'x-forwarded-for': [
              {
                key: 'X-Forwarded-For',
                value: '108.41.158.64',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Amazon CloudFront',
              },
            ],
            via: [
              {
                key: 'Via',
                value: '1.1 bcf69805bd7618b134f85cb9528fba32.cloudfront.net (CloudFront)',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'image-test-images.s3.eu-central-1.amazonaws.com',
              },
            ],
            'cache-control': [
              {
                key: 'Cache-Control',
                value: 'max-age=0',
              },
            ],
          },
          method: 'GET',
          origin: {
            s3: {
              authMethod: 'origin-access-identity',
              customHeaders: {},
              domainName: 'image-test-images.s3.eu-central-1.amazonaws.com',
              path: '',
              region: 'eu-central-1',
            },
          },
          querystring,
          uri,
        },
        response: {
          headers: {
            'x-amz-request-id': [
              {
                key: 'x-amz-request-id',
                value: 'XPWJPWV1KP5CFDTS',
              },
            ],
            'x-amz-id-2': [
              {
                key: 'x-amz-id-2',
                value: 'QZlgZ/jWFGkc/pjNjijOkI1KjEH7avdgXL/2r5kuD7xMWFs6K3CSnHycKhzcVrN1chM0Hkq+IQM=',
              },
            ],
            date: [
              {
                key: 'Date',
                value: 'Sat, 08 May 2021 23:33:25 GMT',
              },
            ],
            server: [
              {
                key: 'Server',
                value: 'AmazonS3',
              },
            ],
            'content-type': [
              {
                key: 'Content-Type',
                value: 'application/xml',
              },
            ],
            'transfer-encoding': [
              {
                key: 'Transfer-Encoding',
                value: 'chunked',
              },
            ],
          },
          status: '404',
          statusDescription: 'Not Found',
        },
      },
    },
  ],
})

const mockBadKeyEvent = (
  uri = 'bad-image.png',
  querystring = 'ext=webp&fmt=webp&height=400&sourceImage=/bad-image.png&width=700',
): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'origin-response',
          requestId: 'KN-wBwbmbE62plUp5mxC6hxzoXSOt9n6OZ06z2LjULGpbpOCpRWwqw==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            'x-forwarded-for': [
              {
                key: 'X-Forwarded-For',
                value: '108.41.158.64',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Amazon CloudFront',
              },
            ],
            via: [
              {
                key: 'Via',
                value: '1.1 4d8d3505beb1aa504be6a19a0d2e784c.cloudfront.net (CloudFront)',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'image-test-images.s3.amazonaws.com',
              },
            ],
          },
          method: 'GET',
          origin: {
            s3: {
              authMethod: 'origin-access-identity',
              customHeaders: {},
              domainName: 'image-test-images.s3.eu-central-1.amazonaws.com',
              path: '',
              region: 'eu-central-1',
            },
          },
          querystring,
          uri,
        },
        response: {
          headers: {
            'x-amz-request-id': [
              {
                key: 'x-amz-request-id',
                value: 'VWT4ZVZW6KVSZXK5',
              },
            ],
            'x-amz-id-2': [
              {
                key: 'x-amz-id-2',
                value: '4/PLziA+bP9cjFWVFErAyGd5NuOWY4E8XuE3DH0J913HugdpsWOCg+MsIAapBR8CXjT15VBywq8=',
              },
            ],
            date: [
              {
                key: 'Date',
                value: 'Sat, 08 May 2021 23:38:02 GMT',
              },
            ],
            server: [
              {
                key: 'Server',
                value: 'AmazonS3',
              },
            ],
            'content-type': [
              {
                key: 'Content-Type',
                value: 'application/xml',
              },
            ],
            'transfer-encoding': [
              {
                key: 'Transfer-Encoding',
                value: 'chunked',
              },
            ],
          },
          status: '404',
          statusDescription: 'Not Found',
        },
      },
    },
  ],
})

const mockStaticWebsite404Event = (
  uri = 'good-image.png',
  querystring = 'ext=avif&fmt=avif&height=200&sourceImage=/good-image.png&width=700',
): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'origin-response',
          requestId: 'ZglsXKNU9HC_gwfO1qhXqGh_AipNOvr73VwCe0CTN3-Guu-b1C5MEw==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            'x-forwarded-for': [
              {
                key: 'X-Forwarded-For',
                value: '108.41.158.64',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Amazon CloudFront',
              },
            ],
            via: [
              {
                key: 'Via',
                value: '1.1 bcf69805bd7618b134f85cb9528fba32.cloudfront.net (CloudFront)',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip',
              },
            ],
            host: [
              {
                key: 'Host',
                value: 'image-test-images.s3.amazonaws.com',
              },
            ],
            'cache-control': [
              {
                key: 'Cache-Control',
                value: 'max-age=0',
              },
            ],
          },
          method: 'GET',
          origin: {
            custom: {
              customHeaders: {},
              domainName: 'image-test-yeah.s3-website.eu-central-1.amazonaws.com',
              keepaliveTimeout: 5,
              path: '',
              port: 80,
              protocol: 'http',
              readTimeout: 30,
              sslProtocols: ['TLSv1.2'],
            },
          },
          querystring,
          uri,
        },
        response: {
          headers: {
            'x-amz-id-2': [
              {
                key: 'x-amz-id-2',
                value: '8q8ejgujau4YCUdFL3Ck1VPB6PsiEr/60RIZPUDxgOuzM/t/Dueg5SG1RdbKxnFKN7u+Yt8QkiI=',
              },
            ],
            'x-amz-request-id': [
              {
                key: 'x-amz-request-id',
                value: '37THKNX0N2ADYKS3',
              },
            ],
            date: [
              {
                key: 'Date',
                value: 'Sat, 08 May 2021 23:36:25 GMT',
              },
            ],
            'last-modified': [
              {
                key: 'Last-Modified',
                value: 'Sat, 08 May 2021 23:33:28 GMT',
              },
            ],
            etag: [
              {
                key: 'ETag',
                value: '"72a9ff667c12b7d156a696877fc4df89"',
              },
            ],
            'accept-ranges': [
              {
                key: 'Accept-Ranges',
                value: 'bytes',
              },
            ],
            server: [
              {
                key: 'Server',
                value: 'AmazonS3',
              },
            ],
            'content-type': [
              {
                key: 'Content-Type',
                value: 'application/xml',
              },
            ],
            'content-length': [
              {
                key: 'Content-Length',
                value: '2832',
              },
            ],
          },
          status: '404',
          statusDescription: 'Not Found',
        },
      },
    },
  ],
})

function mockS3Responses() {
  const mockImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
  const validObjectKey = 'good-image.png'

  return mockS3Client()
    .on(GetObjectCommand)
    .rejects(new Error(`Invalid object key`))
    .on(GetObjectCommand, {Key: validObjectKey})
    .resolves({
      Body: sdkStreamMixin(Readable.from(Buffer.from(mockImage, 'base64'))),
    })
}

const mockImageTransformer = (): ImageTransformer => ({
  transform: (image: Buffer, parameters: {width?: number; height?: number; format?: Format}): Promise<Buffer> => {
    return Promise.resolve(image)
  },
})
