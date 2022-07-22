## ErrorInLogAlarm

Construct that contains a cloudwatch alarm that will trigger when an aws-logs log group will output errors. 

What an "error" is can be configured with `props.errorFilterPattern`. It defaults to: `' error ', ' ERROR ', ' Error '`
