const path = require('path')

module.exports = {
    displayName: 'aws-cdk-pattens',
    roots: [path.join(__dirname, 'src')],
    testMatch: ['<rootDir>/**/*.(test).ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.ts': ['ts-jest', {
          tsconfig: '<rootDir>/tsconfig.cjs.json',
        }],
    },
    watchPlugins: ['jest-watch-select-projects'],
    testEnvironment: 'node',
}
