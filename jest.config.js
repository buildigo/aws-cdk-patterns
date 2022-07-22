import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  displayName: 'aws-cdk-pattens',
  roots: [join(__dirname, 'src')],
  testMatch: ['<rootDir>/**/*.(test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  watchPlugins: ['jest-watch-select-projects'],
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
}
