module.exports = {
  devServer: {
    proxy: {
      "/pic": {
        target: "http://www.lemonavy.top/",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          // '^/pic': ''
        }
      },
    },
    overlay: {
      warnings: false,
      errors: false
    }
  },
  lintOnSave: false
};