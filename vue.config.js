module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'http://192.168.3.3:8082',
                ws: false,
                changeOrigin: true,
            }
        }
    }
}