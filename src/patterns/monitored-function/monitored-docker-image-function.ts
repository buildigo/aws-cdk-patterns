import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Construct} from 'constructs'
import {MonitoredFunctionBase, MonitoredFunctionProps} from './monitored-function.base'

export class MonitoredDockerImageFunction extends MonitoredFunctionBase<lambda.DockerImageFunctionProps> {
  constructor(scope: Construct, id: string, props: MonitoredFunctionProps & lambda.DockerImageFunctionProps) {
    super(scope, id, props)
  }

  override setupFunction(props: lambda.DockerImageFunctionProps): lambda.Function {
    return new lambda.DockerImageFunction(this, 'Function', props)
  }
}
