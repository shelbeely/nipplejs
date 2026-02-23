const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.commonjs,
            },
        },
        rules: {
            'no-unused-vars': [
                'error',
                { 'args': 'none' },
            ],
            'indent': [
                'error',
                4,
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'always',
            ],
        },
    },
];
