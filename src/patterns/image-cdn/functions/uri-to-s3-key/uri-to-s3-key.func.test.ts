/* eslint-disable @typescript-eslint/no-explicit-any */
import {handler as uriToS3Key} from './uri-to-s3-key.func'
import {CloudFrontRequestEvent} from 'aws-lambda'

describe('UriToS3Key', () => {
  it('should leave a request without parameters untouched', async () => {
    const response = await uriToS3Key(mockEvent('/ghosted.jpg'), undefined as any, undefined as any)
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted.jpg"`)
    expect(response?.querystring).toMatchInlineSnapshot(`""`)
  })
  it('should leave a request with unsupported extension untouched even when accept header supports avif/webp', async () => {
    const response = await uriToS3Key(
      mockEvent('/assets/images/some-icon.svg', '', 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'),
      undefined as any,
      undefined as any,
    )
    expect(response?.uri).toMatchInlineSnapshot(`"/assets/images/some-icon.svg"`)
    expect(response?.querystring).toMatchInlineSnapshot(`""`)
  })
  it('should process a single parameter', async () => {
    const response = await uriToS3Key(mockEvent('/ghosted.jpg', 'w=300'), undefined as any, undefined as any)
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted_300x.jpeg"`)
    expect(response?.querystring).toMatchInlineSnapshot(`"w=300&sourceImage=%2Fghosted.jpg&ext=jpeg"`)
  })
  it('should process multiple parameters', async () => {
    const response = await uriToS3Key(
      mockEvent('/ghosted.jpg', 'w=300&h=500&fmt=png'),
      undefined as any,
      undefined as any,
    )
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted_300x500.png"`)
    expect(response?.querystring).toMatchInlineSnapshot(`"w=300&h=500&fmt=png&sourceImage=%2Fghosted.jpg&ext=png"`)
  })
  it('should process multiple parameters and leave existing parameters', async () => {
    const response = await uriToS3Key(
      mockEvent('/ghosted.jpg', 'w=300&h=500&fmt=png&existing=value1&existing=value2&signature=1234'),
      undefined as any,
      undefined as any,
    )
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted_300x500.png"`)
    expect(response?.querystring).toMatchInlineSnapshot(
      `"existing=value1&existing=value2&signature=1234&w=300&h=500&fmt=png&sourceImage=%2Fghosted.jpg&ext=png"`,
    )
  })
  it('should process a uri with a prefix and parameters', async () => {
    const response = await uriToS3Key(
      mockEvent('/some/path/to/ghosted.jpg', 'w=300&h=500&fmt=png'),
      undefined as any,
      undefined as any,
    )
    expect(response?.uri).toMatchInlineSnapshot(`"/some/path/to/ghosted_300x500.png"`)
    expect(response?.querystring).toMatchInlineSnapshot(
      `"w=300&h=500&fmt=png&sourceImage=%2Fsome%2Fpath%2Fto%2Fghosted.jpg&ext=png"`,
    )
    expect(response).toMatchSnapshot()
  })
  it('should normalize the jpg extension', async () => {
    const response = await uriToS3Key(mockEvent('/ghosted.jpg', 'w=300'), undefined as any, undefined as any)
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted_300x.jpeg"`)
    expect(response?.querystring).toMatchInlineSnapshot(`"w=300&sourceImage=%2Fghosted.jpg&ext=jpeg"`)
  })
  it('should use the accept header to determine the image most appropriate format', async () => {
    // avif support
    const response = await uriToS3Key(
      mockEvent(
        '/ghosted.jpg',
        'w=300',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      ),
      undefined as any,
      undefined as any,
    )
    expect(response?.uri).toMatchInlineSnapshot(`"/ghosted_300x.avif"`)
    expect(response?.querystring).toMatchInlineSnapshot(`"w=300&fmt=avif&sourceImage=%2Fghosted.jpg&ext=avif"`)

    // webp support
    const response2 = await uriToS3Key(
      mockEvent(
        '/ghosted.jpg',
        'w=300',
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      ),
      undefined as any,
      undefined as any,
    )
    expect(response2?.uri).toMatchInlineSnapshot(`"/ghosted_300x.webp"`)
    expect(response2?.querystring).toMatchInlineSnapshot(`"w=300&fmt=webp&sourceImage=%2Fghosted.jpg&ext=webp"`)
  })
  it('should ignore a format value not supported and autoFormat', async () => {
    const r1 = await uriToS3Key(mockEvent('/ghosted.jpg', 'fmt=*&w=300'), undefined as any, undefined as any)
    expect(r1?.uri).toMatchInlineSnapshot(`"/ghosted_300x.jpeg"`)
    expect(r1?.querystring).toMatchInlineSnapshot(`"w=300&sourceImage=%2Fghosted.jpg&ext=jpeg"`)
    // auto format
    const r2 = await uriToS3Key(
      mockEvent(
        '/ghosted.jpg',
        'fmt=*&w=300',
        'image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      ),
      undefined as any,
      undefined as any,
    )
    expect(r2?.uri).toMatchInlineSnapshot(`"/ghosted_300x.avif"`)
    expect(r2?.querystring).toMatchInlineSnapshot(`"w=300&fmt=avif&sourceImage=%2Fghosted.jpg&ext=avif"`)
  })
})

const mockEvent = (
  uri = '/ghosted.jpg',
  querystring = '',
  accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
): CloudFrontRequestEvent => ({
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1ppm5fhf7dvj2.cloudfront.net',
          distributionId: 'E3FLSY2KR0CQYV',
          eventType: 'viewer-request',
          requestId: 'N97qvOQyYTiydBX1BZDG9QcXrrepJtRnU-lAbzMKNK_tXpKGEUN3PQ==',
        },
        request: {
          clientIp: '108.41.158.64',
          headers: {
            host: [
              {
                key: 'Host',
                value: 'd1ppm5fhf7dvj2.cloudfront.net',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value:
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
              },
            ],
            'cache-control': [
              {
                key: 'Cache-Control',
                value: 'max-age=0',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'Upgrade-Insecure-Requests',
                value: '1',
              },
            ],
            accept: [
              {
                key: 'Accept',
                value: accept,
              },
            ],
            'accept-encoding': [
              {
                key: 'Accept-Encoding',
                value: 'gzip, deflate',
              },
            ],
            'accept-language': [
              {
                key: 'Accept-Language',
                value: 'en-US,en;q=0.9',
              },
            ],
          },
          method: 'GET',
          querystring,
          uri,
        },
      },
    },
  ],
})
