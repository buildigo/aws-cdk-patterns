import {Format} from '../image-api.types'
import Sharp from 'sharp'
import {ImageTransformer} from './image-transformer.types'

export class SharpImageTransformer implements ImageTransformer {
  transform(image: Buffer, parameters: {width?: number; height?: number; format?: Format}): Promise<Buffer> {
    let stream = Sharp(image)
    if (parameters.height || parameters.width) {
      stream = stream.resize({width: parameters.width, height: parameters.height})
    }
    if (parameters.format) {
      switch (parameters.format) {
        case Format.JPG:
          stream = stream.toFormat('jpeg')
          break
        case Format.PNG:
          stream = stream.toFormat('png')
          break
        case Format.WEBP:
          stream = stream.toFormat('webp')
          break
        case Format.AVIF:
          stream = stream.toFormat('avif', {effort: 2, chromaSubsampling: '4:2:0'})
          break
      }
    }
    return stream.toBuffer()
  }
}
