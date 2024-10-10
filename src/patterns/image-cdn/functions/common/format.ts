import {Format} from '../image-api.types'
import {isString} from 'lodash'

export function parseFormatValue(fmt?: unknown): Format | undefined {
  if (!isString(fmt)) {
    return undefined
  }
  switch (fmt) {
    case 'jpg':
    case 'jpeg':
      return Format.JPG
    case 'png':
      return Format.PNG
    case 'avif':
      return Format.AVIF
    case 'webp':
      return Format.WEBP
    default:
      return undefined
  }
}
