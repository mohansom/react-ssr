const axios = require('axios')
const path = require('path')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')

const mfs = new MemoryFs()
const serverCompiler =  webpack(serverConfig)
let serverBundle
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
    if(err) throw err
    stats = stats.toJson()
    stats.errors.forEach( err => console.log(err))
    stats.warnings.forEach( war => console.log(war))

    const bundlePath = path.join(
        serverConfig.output.path,
        serverConfig.output.filename
    )
    const bundle = mfs.readFileSync(bundlePath,'utf-8')
    const m = getModuleFromString(bundle,"server-entry.js")
    serverBundle = m.exports
})

//从开发环境服务获取index.html模板
const getTemplate = () => {
    return new Promise((resolve,reject) => {
        axios.get('http://localhost:3006/public/index.html').then(res => {
            resolve(res.data)
        }).catch(reject)
    })
}

const NativeModule = require('module');
const vm = require('vm');

/**
 * 解决依赖包找不到的问题
 */
const getModuleFromString = (bundle,filename) => {
    const m = {exports:{}};
    const wrapper = NativeModule.wrap(bundle);
    const script = new vm.Script(wrapper,{
        filename:filename,
        displayErrors:true
    });

    const result = script.runInThisContext()
    result.call(m.exports,m.exports,require,m)
    return m
};

module.exports = (app) => {
    //转发静态文件代理
    app.use('/public',proxy({
        target:'http://localhost:3006'
    }))
    app.get('*',(req, res) => {
        console.log("serverbundle is ",serverBundle.default);
        if(!serverBundle){
            return res.send("请等待...编译，稍后刷新")
        }

        getTemplate().then((template) => {
            const appBundle = serverBundle.default;
            const content =  ReactDomServer.renderToString(appBundle());
            res.send(template.replace('<!-- app -->',content))
        }).catch(error => {
            console.log("error happend","error")
        })
    })
}
