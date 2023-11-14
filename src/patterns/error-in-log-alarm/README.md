## ErrorInLogAlarm

Construct that contains a cloudwatch alarm that will trigger when an aws-logs log group will output errors. 

What an "error" is can be configured with `props.errorFilterPattern`. 

Its defaults expects JSON-based logging, and will trigger if one of these conditions is met:

- The json root field `level` equals `error`
- The json root field `error` exists and has a `name` field set to a string
- The json root field `message` contains the word "error" (case insensitive)

Examples (would all match):
```
{"timestamp":"2023-11-14T08:51:06.613Z","level":"info","message":"This would match because there the word error in the message"}
{"timestamp":"2023-11-14T08:51:06.613Z","level":"error","message":"This would match because of the level"}
{"timestamp":"2023-11-14T08:51:06.613Z","level":"debug","message":"This would match because of the next field","error":{"name":"Error","message":"OH NO!"}
```