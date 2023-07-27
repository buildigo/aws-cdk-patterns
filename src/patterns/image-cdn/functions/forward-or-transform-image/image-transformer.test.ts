import {images} from '../../../../../test/fixtures'
import {SharpImageTransformer} from './image-transformer'
import Sharp from 'sharp'
import {Format} from '../image-api.types'

const transformer = new SharpImageTransformer()

it('resizes width', async () => {
  const resized = await transformer.transform(await images.inputJpeg(), {width: 250})
  const {width} = await metadata(resized)
  expect(width).toBe(250)
})

it('resizes height', async () => {
  const resized = await transformer.transform(await images.inputJpeg(), {height: 786})
  const {height} = await metadata(resized)
  expect(height).toBe(786)
})

it('does not enlarge', async () => {
  const resized = await transformer.transform(await images.inputJpeg(), {width: 4000}, {withoutEnlargement: true})
  const {width} = await metadata(resized)
  expect(width).toBe(2725) // original size
})

it('changes format to webp', async () => {
  const resized = await transformer.transform(await images.inputJpeg(), {format: Format.WEBP})
  const {format} = await metadata(resized)
  expect(format).toBe('webp')
})

function metadata(image: Buffer) {
  return Sharp(image).metadata()
}
