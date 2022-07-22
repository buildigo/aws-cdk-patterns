## MonitoredLambda & MonitoredDockerImageLambda

Construct that, when prop `bgo.deployMonitoringAndAlerting` is true will deploy monitoring around the lambda function, including:

- A failed invocation alarm that triggers when the function invocation fails
- An error-in-log alarm that triggers when an error is read in the logs output
- Enabled X-Ray tracing
- Enabled Lambda Insights


What an "error" is can be configured with `props.errorFilterPattern`. It defaults to: `' error ', ' ERROR ', ' Error '`
