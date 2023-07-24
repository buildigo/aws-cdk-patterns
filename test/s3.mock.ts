import {mockClient} from 'aws-sdk-client-mock'
import {S3Client} from '@aws-sdk/client-s3'
// import jest matchers to be allowed to use assertions like `toHaveReceivedCommand`
// https://github.com/m-radzikowski/aws-sdk-client-mock#jest-matchers
import 'aws-sdk-client-mock-jest'

export function mockS3Client() {
  const s3 = mockClient(S3Client)
  return s3
}
