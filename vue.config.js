module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'http://192.168.3.18:8082',
                ws: false,
                changeOrigin: true,
            }
        }
    },
    publicPath: '/',
    chainWebpack: config => {
        //设置标题  默认不设置的话是项目名字
        config.plugin('html').tap(args => {
          args[0].title = "AnimeRSS"
          return args
        })
    }
}