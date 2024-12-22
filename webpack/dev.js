const common = require('./common')

const path = require('path')
const { merge } = require('webpack-merge')

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'app.bundle.js',
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../dist'),
        },
        client: {
            overlay: false,
        },
        compress: true,
        port: 9001,
        hot: true,
        historyApiFallback: true,
    },
})
