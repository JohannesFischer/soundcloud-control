const path = require('path')
const srcFolder = path.join(__dirname, 'src')

module.exports = {
  context: srcFolder,
  entry: {
    background: './background.js',
    content: './content.js',
    'popup/popup': './popup/popup.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: srcFolder
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  },
  resolve: {
    alias: {
      src: srcFolder
    }
  }
}
