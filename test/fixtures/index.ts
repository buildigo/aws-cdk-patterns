import {join} from 'path'
import {readFile} from 'fs/promises'

function getPath(filename: string) {
  return join(__dirname, filename)
}

export const images = {
  inputJpeg: () => readFile(getPath('2569067123_aca715a2ee_o.jpg')),
  portraitWithExif: () => readFile(getPath('portrait-with-exif.jpg')),
}
