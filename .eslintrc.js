module.exports = {
    env: {
        node: true,
    },
    extends: ['@buildigo/eslint-config-typescript'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.ts'],
            extends: ['@buildigo/eslint-config-typescript'],
            settings: {
                'import/resolver': {
                    typescript: {
                        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/aws-lambda`
                        project: '<root>/tsconfig.base.json',
                    },
                },
            },
        },
    ],

}
