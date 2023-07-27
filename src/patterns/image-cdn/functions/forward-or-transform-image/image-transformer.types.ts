import {Format} from '../image-api.types'

export interface ImageTransformer {
  transform(
    image: Buffer,
    parameters: {width?: number; height?: number; format?: Format},
    opts?: {withoutEnlargement: boolean},
  ): Promise<Buffer>
}
