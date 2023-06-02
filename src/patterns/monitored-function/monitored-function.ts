import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Construct} from 'constructs'
import {MonitoredFunctionBase, MonitoredFunctionProps} from './monitored-function.base'
import * as iam from 'aws-cdk-lib/aws-iam'

export class MonitoredFunction extends MonitoredFunctionBase<lambda.FunctionProps> {
  constructor(scope: Construct, id: string, props: MonitoredFunctionProps & lambda.FunctionProps) {
    super(scope, id, props)
  }

  override setupFunction(props: lambda.FunctionProps): lambda.Function {
    const fn = new lambda.Function(this, 'Function', this.applyDefault(props))
    fn.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'))
    return fn
  }

  private applyDefault(props: lambda.FunctionProps): lambda.FunctionProps {
    return {
      insightsVersion: lambda.LambdaInsightsVersion.fromInsightVersionArn(this.insightsLayerArn()),
      ...props,
    }
  }

  private insightsLayerArn(): string {
    if (this.isArm64()) {
      return 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:2'
    } else {
      return 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:35'
    }
  }

  private isArm64() {
    const architecture = this.props.architecture
    return architecture && architecture.name === lambda.Architecture.ARM_64.name
  }
}
