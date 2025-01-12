const express = require('express')
const fs = require('fs')
const path = require('path')
const ReactSSR = require('react-dom/server')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

if(!isDev){
    const serverEntry = require('../dist/server-entry').default
    const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8')

    app.use('/public',express.static(path.join(__dirname,'../dist')))

    app.get('*',(req, res) => {
        const appString = ReactSSR.renderToString(serverEntry)
        res.send(template.replace('<!-- app -->',appString))
    })
}else{
    const staticRender = require('./utils/static-render')
    staticRender(app)
}
app.listen(3333, () => {
    console.log('server is listening on 3333')
})