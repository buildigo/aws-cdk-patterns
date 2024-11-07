import {SharpImageTransformer} from './image-transformer'
import {readFile, writeFile} from 'fs/promises'
import {Format} from '../image-api.types'
import {randomUUID} from 'crypto'

async function main() {
  const t = new SharpImageTransformer()
  const image = await readFile('test.jpg')
  const format = Format.AVIF
  const res = await t.transform(image, {height: 300, format})
  await writeFile(`${randomUUID()}.${format.toLowerCase()}`, res)
}

main().then(() => console.log('done'))
