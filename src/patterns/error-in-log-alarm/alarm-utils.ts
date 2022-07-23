import * as logs from 'aws-cdk-lib/aws-logs'

const ALARM_NAME_SUFFIX = 'ErrorInLogAlarm'
const ALARM_DESCRIPTION_PREFIX = 'Alarm for Errors in LogGroup: '

export function isErrorLogAlarm(alarmName: string): boolean {
  return alarmName?.indexOf(ALARM_NAME_SUFFIX) > 0
}

export function errorLogFilterPattern(): logs.IFilterPattern {
  return logs.FilterPattern.anyTerm(' error ', ' ERROR ', ' Error ')
}

/**
 * Guarantees a common pattern for an alarm that is based on an error log metric. This convention helps us
 * when evaluating alarms. E.g. if an alarm is an alarm based on a log metric instead.
 */
export function createErrorLogAlarmName(resourceName: string): string {
  return `${resourceName}${ALARM_NAME_SUFFIX}`
}

/**
 * The name of the LogGroup gets written into Alarm description. When an alarm is triggered one can get the related
 * LogGroup through the description. By having the name of the LogGroup one can provide more alarm context information
 * in slack notification (direct link to error log or even the logs itself).
 */
export function createErrorLogAlarmDescription(logGroupName: string): string {
  return `${ALARM_DESCRIPTION_PREFIX}${logGroupName}`
}

export function parseLogGroupFromAlarmDescription(alarmDescription?: string): string | undefined {
  if (!alarmDescription || alarmDescription.indexOf(ALARM_DESCRIPTION_PREFIX) < 0) {
    return undefined
  }
  return alarmDescription.slice(ALARM_DESCRIPTION_PREFIX.length)
}
