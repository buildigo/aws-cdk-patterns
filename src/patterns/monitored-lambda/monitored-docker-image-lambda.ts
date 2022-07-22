import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Construct} from 'constructs'
import {MonitoredLambdaBase, MonitoredLambdaProps} from './monitored-lambda.base'

export class MonitoredDockerImageLambda extends MonitoredLambdaBase<lambda.DockerImageFunctionProps> {
  constructor(scope: Construct, id: string, props: MonitoredLambdaProps & lambda.DockerImageFunctionProps) {
    super(scope, id, props)
  }

  override setupFunction(props: lambda.DockerImageFunctionProps): lambda.Function {
    return new lambda.DockerImageFunction(this, 'Function', props)
  }
}
