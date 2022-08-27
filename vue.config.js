require('dotenv').config();
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})


module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.BACKEND_HOST,
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
}

