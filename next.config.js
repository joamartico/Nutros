const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const withPWA = require('next-pwa')

module.exports = withPWA({
  
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
    

  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              'node_modules/ionicons/dist/ionicons/svg'
            ),
            to: path.join(__dirname, 'public/svg'),
          },
        ],
      })
    )
    return config
  },
})
