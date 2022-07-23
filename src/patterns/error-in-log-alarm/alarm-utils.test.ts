import {
  createErrorLogAlarmDescription,
  createErrorLogAlarmName,
  errorLogFilterPattern,
  isErrorLogAlarm,
  parseLogGroupFromAlarmDescription,
} from './alarm-utils'

test('isErrorLogAlarm', () => {
  expect(isErrorLogAlarm('BgoCustomerNotificationPersonalErrorInLogAlarm')).toBeTruthy()
  expect(
    isErrorLogAlarm('BgoBackendPersonal-BgoPayrexxEventWebhookPersonalFunctionInvokeErrors84E99267-VADPUCP023Y5'),
  ).toBeFalsy()
})

test('createErrorLogAlarmName', () => {
  expect(createErrorLogAlarmName('NotificationLambda')).toEqual('NotificationLambdaErrorInLogAlarm')
})

test('createErrorLogAlarmDescription', () => {
  expect(createErrorLogAlarmDescription('bgo/BackendContainer')).toEqual(
    'Alarm for Errors in LogGroup: bgo/BackendContainer',
  )
})

test('errorLogFilternPattern', () => {
  expect(errorLogFilterPattern().logPatternString).toEqual('?" error " ?" ERROR " ?" Error "')
})

test('parseLogGroupFromAlarmDescription', () => {
  expect(parseLogGroupFromAlarmDescription('Alarm for Errors in LogGroup: bgo/BackendContainer')).toEqual(
    'bgo/BackendContainer',
  )
})
