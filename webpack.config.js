const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const NAME = 'nipplejs';

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    mode: DEBUG ? 'development' : 'production',
    devServer: {
        static: {
            directory: __dirname,
        },
        devMiddleware: {
            publicPath: '/dist/',
        },
        port: 9000,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${NAME}.js`,
        library: {
            name: NAME,
            type: 'umd',
            export: 'default',
            umdNamedDefine: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    plugins: [
        new ESLintPlugin(),
    ],
};
