const common = require('./common')

const { merge } = require('webpack-merge')
const path = require('path')

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../../dist'),
        filename: 'app.app.js',
        publicPath: '/',
    },
    optimization: {
        minimize: true,
    },
})
