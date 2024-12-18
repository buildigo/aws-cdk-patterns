import {Format} from '../image-api.types'
import Sharp from 'sharp'
import {ImageTransformer} from './image-transformer.types'

export class SharpImageTransformer implements ImageTransformer {
  transform(
    image: Buffer,
    parameters: {width?: number; height?: number; format?: Format},
    opts?: {withoutEnlargement: boolean},
  ): Promise<Buffer> {
    let stream = Sharp(image)
      // keep exif metadata to avoid orientation issues
      .withMetadata()

    if (parameters.height || parameters.width) {
      stream = stream.resize({
        width: parameters.width,
        height: parameters.height,
        withoutEnlargement: opts?.withoutEnlargement,
      })
    }
    if (parameters.format) {
      switch (parameters.format) {
        case Format.JPG:
          stream = stream.toFormat('jpeg')
          break
        case Format.PNG:
          stream = stream
            .rotate() // png EXIF supports seems limited in sharp - without this, portrait images from iOS will appear in landscape
            .toFormat('png')
          break
        case Format.WEBP:
          stream = stream.toFormat('webp')
          break
        case Format.AVIF:
          stream = stream
            .rotate() // avif does not support EXIF metadata, so rotate it first to make sure orientation is maintained - without this, portrait images from iOS will appear in landscape
            .toFormat('avif', {effort: 2, chromaSubsampling: '4:2:0'})
          break
      }
    }
    return stream.toBuffer()
  }
}
