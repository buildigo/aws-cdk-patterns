import {Duration} from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import {createErrorLogAlarmDescription, createErrorLogAlarmName, errorLogFilterPattern} from './alarm-utils'
import {Construct} from 'constructs'

export interface ErrorInLogAlarmProps {
  resourceName: string
  logGroup: logs.ILogGroup
  namespace?: string
  /** filter pattern that will trigger the alarm when matching */
  errorFilterPattern?: logs.IFilterPattern
}

export class ErrorInLogAlarm extends Construct {
  readonly alarm: cloudwatch.Alarm
  private readonly props: Required<ErrorInLogAlarmProps>

  constructor(scope: Construct, private readonly id: string, props: ErrorInLogAlarmProps) {
    super(scope, id)
    this.props = this.applyDefaults(props)
    this.alarm = this.createErrorLogAlarm(this.props.resourceName, this.props.logGroup)
  }

  private applyDefaults(props: ErrorInLogAlarmProps): Required<ErrorInLogAlarmProps> {
    return {
      ...props,
      namespace: props.namespace ?? 'BGO/CustomMetrics',
      errorFilterPattern: props.errorFilterPattern ?? errorLogFilterPattern(),
    }
  }
  private createErrorLogAlarm(resourceName: string, logGroup: logs.ILogGroup): cloudwatch.Alarm {
    // create an error metric filter in the logs metric
    const errorMetricProps: logs.MetricFilterProps = {
      logGroup,
      metricName: resourceName + 'ErrorInLogMetric',
      metricNamespace: this.props.namespace,
      filterPattern: this.props.errorFilterPattern,
    }
    new logs.MetricFilter(this, `ErrorInLogMetricFilter`, errorMetricProps)

    // create an alarm on top of the error in the logs metric
    return new cloudwatch.Alarm(this, `ErrorInLogAlarm`, {
      alarmName: createErrorLogAlarmName(resourceName),
      alarmDescription: createErrorLogAlarmDescription(logGroup.logGroupName),
      metric: new cloudwatch.Metric({
        namespace: errorMetricProps.metricNamespace,
        metricName: errorMetricProps.metricName,
        statistic: 'sum',
        period: Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    })
  }
}
