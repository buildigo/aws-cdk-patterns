import {
  createErrorLogAlarmDescription,
  createErrorLogAlarmName,
  errorLogFilternPattern,
  isErrorLogAlarm,
  parseLogGroupFromAlarmDescription,
} from './alarm-utils'

test('isErrorLogAlarm', () => {
  expect(isErrorLogAlarm('BgoCustomerNotificationPersonalLogErrorsAlarm')).toBeTruthy()
  expect(
    isErrorLogAlarm('BgoBackendPersonal-BgoPayrexxEventWebhookPersonalFunctionInvokeErrors84E99267-VADPUCP023Y5'),
  ).toBeFalsy()
})

test('createErrorLogAlarmName', () => {
  expect(createErrorLogAlarmName('NotificationLambda')).toEqual('NotificationLambdaLogErrorsAlarm')
})

test('createErrorLogAlarmDescription', () => {
  expect(createErrorLogAlarmDescription('bgo/BackendContainer')).toEqual(
    'Alarm for Errors in LogGroup: bgo/BackendContainer',
  )
})

test('errorLogFilternPattern', () => {
  expect(errorLogFilternPattern().logPatternString).toEqual('?" error " ?" ERROR " ?" Error "')
})

test('parseLogGroupFromAlarmDescription', () => {
  expect(parseLogGroupFromAlarmDescription('Alarm for Errors in LogGroup: bgo/BackendContainer')).toEqual(
    'bgo/BackendContainer',
  )
})
