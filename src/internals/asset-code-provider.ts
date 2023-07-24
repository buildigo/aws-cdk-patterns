import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as deployment from 'aws-cdk-lib/aws-s3-deployment'
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets'

/**
 * In order to make the CDK stack unit-testable, this resolver was introduced. Instead of creating an AssetCode construct
 * directly within the stack, the creation is delegated to this guy. This way we can return a fake-assetcode folder and
 * don't need to transpile all typescript files everytime before running the jest test.
 */
export class AssetCodeProvider {
  lambdaAsset(path: string) {
    return new lambda.AssetCode(path)
  }

  deploymentAsset(path: string, options?: s3_assets.AssetOptions): deployment.ISource {
    return deployment.Source.asset(path, options)
  }
}
