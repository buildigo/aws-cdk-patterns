import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Duration} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import {ErrorInLogAlarm} from '../error-in-log-alarm/error-in-log-alarm'
import * as logs from 'aws-cdk-lib/aws-logs'

export interface MonitoredFunctionProps {
  // namespace to avoid conflicts with lambda props
  bgo: {
    deployMonitoringAndAlerting: boolean
    errorInLogAlarm?: {
      namespace?: string
      errorFilterPattern?: logs.IFilterPattern
    }
  }
}

export abstract class MonitoredFunctionBase<FunctionProps extends lambda.FunctionOptions> extends Construct {
  readonly function: lambda.Function
  readonly props: MonitoredFunctionProps & FunctionProps

  public readonly alarms?: {
    failedInvocations: cloudwatch.Alarm
    logError: cloudwatch.Alarm
  }

  protected constructor(
    scope: Construct,
    protected readonly id: string,
    props: MonitoredFunctionProps & FunctionProps,
  ) {
    super(scope, id)
    this.props = this.applyDefaults(props)
    this.function = this.setupFunction(this.props)
    if (props.bgo.deployMonitoringAndAlerting) {
      this.alarms = this.setupMonitoring()
    }
  }

  abstract setupFunction(props: FunctionProps): lambda.Function

  /**
   * Apply buildigo lambda defaults
   */
  private applyDefaults(props: MonitoredFunctionProps & FunctionProps): MonitoredFunctionProps & FunctionProps {
    return {
      tracing: lambda.Tracing.ACTIVE,
      ...props,
    }
  }

  private setupMonitoring() {
    const failedInvocations = new cloudwatch.Alarm(this, `FunctionInvokeErrors`, {
      metric: this.function.metricErrors({period: Duration.minutes(1)}),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    })
    const logError = new ErrorInLogAlarm(this, `ErrorInLogsAlarm`, {
      ...this.props.bgo.errorInLogAlarm,
      logGroup: this.function.logGroup,
      resourceName: this.id,
    })
    return {failedInvocations, logError: logError.alarm}
  }
}
