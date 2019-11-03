const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig,{
    entry:{
        app:path.join(__dirname,'../client/client-entry.js')
    },
    output:{
        filename:'[name].[hash:8].js',
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'../client/template.html'),
            favicon:path.join(__dirname,'../favicon.ico')
        })
    ]
})

if(isDev){
    config.devServer = {
        host:'localhost',
        port:3006,
        hot:true,
        contentBase:path.join(__dirname,'../dist'),
        overlay:{
            errors:true
        },
        publicPath:'/public/',
        historyApiFallback:{
            index:'/public/index.html'
        },
    }
}

module.exports = config