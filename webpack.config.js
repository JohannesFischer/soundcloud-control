const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const srcFolder = path.join(__dirname, 'src')

module.exports = {
  context: srcFolder,
  entry: {
    background: './background.js',
    content: './content.js',
    'options/options': './options/index.js',
    'popup/popup': './popup/index.js'
  },
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/extension')
  },
  plugins: [
    new CopyWebpackPlugin([
      './manifest.json',
      './**/*.html',
      './**/*.css',
      './**/*.png',
      './**/*.svg'
    ])
  ],
  resolve: {
    alias: {
      src: srcFolder
    }
  }
}
