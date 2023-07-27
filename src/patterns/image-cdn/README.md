# Image CDN construct

This construct allows you to add a simple image API to a CloudFront distribution that serves images from an S3 bucket.
The API allows you to resize images, or change format on the fly.

Transformed images are also stored to the S3 bucket, so that transformations are only performed once.

## Installation

```typescript
import {ImageCdn} from '@buildigo/aws-cdk-patterns'

// your S3 bucket
const bucketName = `super-cool-bucket`
const bucket = new s3.Bucket(this, 'MyBucket', {
    // 1 / 
    // name must be explicitely set to allow sync with edge stack, or use 'GENERATE_IF_NEEDED'
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.PhysicalName.html#static-generate_if_needed
    bucketName: `super-cool-bucket`,
})

// your cloudfront distribution
const distribution = new cloudfront.Distribution(this, 'MyDistribution')
const origin = new origins.S3Origin(bucket)

// 2 / create the image CDN
const imageCdn = new ImageCdn(this, 'ImageCDN')

// 3 / the image cdn needs access to the image bucket, in order to get the images and store the transformed images
imageCdn.grantPermissions(bucket)

// wire the image CDN to your cloudfront behavior serving images
const imagesBehavior: cloudfront.AddBehaviorOptions = {
    edgeLambdas: imageApi.edgeLambdas, // 4 / edge lambdas will take care to transform images if needed
    cachePolicy: imageApi.cachePolicy, // 5 / a cache policy is created to cache transformed images and process correctly query parameters
    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
}
distribution.addBehavior('/images/*', origin, imagesBehavior)

// 6 / the us-east-1 region must be bootstrapped, because edge functions are always deployed to us-east-1 and then replicated to appropriate regions
// npx cdk bootstrap aws://${AWS_ACCOUNT_ID}/us-east-1
```

## Usage

Once installed to your cloudfront distribution, you can use query parameters to transform images on the fly:

Example: Transform a PNG to WEBP and resize to 100px width.

`https://my-cloudfront-url.com/images/test.png?w=100&fmt=webp`

### Supported parameters:

- **w**: set the new image width in pixels
- **h**: set the new image height in pixels
- **fmt**: set the new image format
    - jpg
    - png
    - webp
    - avif
    - _Note_: if fmt is not specified, the `accept` header media type will be used to determine if the image should be
      converted