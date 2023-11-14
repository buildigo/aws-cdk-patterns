import {Duration} from 'aws-cdk-lib'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import {Construct} from 'constructs'

export interface ErrorInLogAlarmProps {
  resourceName: string
  logGroup: logs.ILogGroup
  namespace?: string
  /** optional function to override the default alarm name. Defaults to `ErrorInLogAlarm{resourceName}` */
  createAlarmName?: (resourceName: string) => string | undefined
  /** optional function to override the default alarm description. Defaults to `Alarm for Errors in LogGroup: {logGroupName}` */
  createAlarmDescription?: (resourceName: string, logGroupName: string) => string | undefined
  /** filter pattern that will trigger the alarm when matching. See README.md for default */
  errorFilterPattern?: logs.IFilterPattern
}

const ALARM_NAME_SUFFIX = 'ErrorInLogAlarm'
const ALARM_DESCRIPTION_PREFIX = 'Alarm for Errors in LogGroup: '

export class ErrorInLogAlarm extends Construct {
  readonly alarm: cloudwatch.Alarm
  private readonly props: Required<ErrorInLogAlarmProps>

  constructor(scope: Construct, id: string, props: ErrorInLogAlarmProps) {
    super(scope, id)
    this.props = this.applyDefaults(props)
    this.alarm = this.createErrorLogAlarm(this.props.resourceName, this.props.logGroup)
  }

  private applyDefaults(props: ErrorInLogAlarmProps): Required<ErrorInLogAlarmProps> {
    return {
      ...props,
      namespace: props.namespace ?? 'BGO/CustomMetrics',
      errorFilterPattern: props.errorFilterPattern ?? this.defaultErrorInLogFilterPattern(),
      createAlarmName: props.createAlarmName ?? (resourceName => `${resourceName}${ALARM_NAME_SUFFIX}`),
      createAlarmDescription:
        props.createAlarmDescription ?? ((r, logGroupName) => `${ALARM_DESCRIPTION_PREFIX}${logGroupName}`),
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
      alarmName: this.props.createAlarmName(resourceName),
      alarmDescription: this.props.createAlarmDescription(resourceName, logGroup.logGroupName),
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

  private defaultErrorInLogFilterPattern(): logs.IFilterPattern {
    // pattern 1: any log with level error
    // pattern 2: find an error json field ($.error doesn't to match anything when the error field is an object, so we check for the name subfield, which should exist in all errors)
    // pattern 3: any log with message containing " error " (case insensitive)
    // FYI: cloudwatch has an console to test filter patterns, in a log group > edit metric filter
    return logs.FilterPattern.literal(
      '{ ($.level = "error") || ($.error.name = "*") || ($.message = %\\s[eE][rR][rR][oO][rR]\\s%) }',
    )
  }
}
