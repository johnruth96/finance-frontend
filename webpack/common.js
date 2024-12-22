const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.tsx',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Finanzen App',
            template: './src/assets/template.html',
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|js|jsx)$/i,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        "@babel/preset-typescript",
                    ]
                }
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    'style-loader',
                    'css-loader', // TODO: https://webpack.js.org/loaders/css-loader/#recommend
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
        ],
    },
};