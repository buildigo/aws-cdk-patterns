import {Construct} from 'constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import {AssetCodeProvider} from '../../internals/asset-code-provider'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import {Duration} from 'aws-cdk-lib'
import {join} from 'path'
import {IMAGE_API_PARAMS} from './functions/image-api.types'

export class ImageCdn extends Construct {
  public readonly functions: {
    uriToS3KeyFunction: cloudfront.experimental.EdgeFunction
    forwardOrTransformImageFunction: cloudfront.experimental.EdgeFunction
  }

  /**
   * Functions to wire to your cloudfront distribution behavior where your images are served from.
   */
  get edgeLambdas() {
    return [
      {
        functionVersion: this.functions.uriToS3KeyFunction.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
      },
      {
        functionVersion: this.functions.forwardOrTransformImageFunction.currentVersion,
        eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
      },
    ]
  }

  /**
   * Cache policy to wire to your cloudfront behavior, optimised for images and allowing the necessary query parameters.
   */
  get cachePolicy() {
    return new cloudfront.CachePolicy(this, 'ImageCDNCachePolicy', {
      comment: 'Cache policy dedicated for the Image CDN ',
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList(...Object.values(IMAGE_API_PARAMS)),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
    })
  }

  constructor(
    scope: Construct,
    id: string,
    private readonly assetCodeProvider: AssetCodeProvider = new AssetCodeProvider(),
  ) {
    super(scope, id)
    this.functions = this.setupEdgeFunctions()
  }

  private setupEdgeFunctions() {
    const uriToS3KeyFunction = new cloudfront.experimental.EdgeFunction(this, 'UriToS3KeyEdgeFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: this.assetCodeProvider.lambdaAsset(
        join(__dirname, '..', '..', '..', '..', 'dist', 'functions', 'uri-to-s3-key'),
      ),
    })

    const forwardOrTransformImageFunction = new cloudfront.experimental.EdgeFunction(
      this,
      'ForwardOrTransformImageEdgeFn',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'main.handler',
        code: this.assetCodeProvider.lambdaAsset(
          join(__dirname, '..', '..', '..', '..', 'dist', 'functions', 'forward-or-transform-image'),
        ),
        timeout: Duration.seconds(30),
        memorySize: 2048,
      },
    )

    return {uriToS3KeyFunction, forwardOrTransformImageFunction}
  }

  grantPermissions(bucket: s3.IBucket) {
    bucket.grantReadWrite(this.functions.forwardOrTransformImageFunction)
  }
}
