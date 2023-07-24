import {S3Client} from '@aws-sdk/client-s3'
import {CloudFrontResponseEvent, CloudFrontResponseResult, Handler} from 'aws-lambda'
import {SharpImageTransformer} from './image-transformer'
import {processEvent} from './forward-or-transform-image.handler'

const s3 = new S3Client({})
const imageTransformer = new SharpImageTransformer()

export const handler: Handler<CloudFrontResponseEvent, CloudFrontResponseResult> = event =>
  processEvent(s3, imageTransformer, event)
