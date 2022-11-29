const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use( (req, res) => {
        createProxyMiddleware('*', {
            target: 'http://localhost:8080 , http://192.168.1.158:8080',
            headers: {
                "Access-Contorl-Allow-Origin" : "*",
                "userAgent" : req.headers.userAgent + "remember-me/true"
            },
            changeOrigin: true
        })
    }) 
}