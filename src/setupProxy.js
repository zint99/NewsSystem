const { createProxyMiddleware } = require('http-proxy-middleware');
/*
    配置反向代理
*/

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://i.maoyan.com',
            changeOrigin: true,
        })
    )
    app.use(
        /* 只要是/ajax开头的请求，代理会拦截并且转发到https://i.maoyan.com */
        '/ajax',
        createProxyMiddleware({
            target: 'https://i.maoyan.com',
            changeOrigin: true,
        })
    )

}