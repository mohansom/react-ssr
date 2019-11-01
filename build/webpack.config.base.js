const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
    mode: isDev ? 'development':'production',
    output:{
        path:path.join(__dirname,"../dist"),
        publicPath:'/public/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude:/node_modules/,               
                loader: 'babel-loader'
            }
        ]
    },
    plugins:[],
    resolve: {
        extensions: ['.js','.jsx']
    }

}

if(!isDev){
    config.module.rules.push(
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
    )
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:8].css"
        })
    )
}

module.exports = config