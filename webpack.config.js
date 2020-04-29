const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'], // where webpack starts looking for first time
  output: {
    path: path.resolve(__dirname, 'dist'),
    //__dirname stands for current absolute path|| we join curr abs path with path where we want the bundle to be
    filename: 'js/bundle.js',
  }, // where to save our bundle file
  //mode: 'development', // it doesn't reduces bundle size or make any optimize|| production - mode does
  devServer: {
    contentBase: './dist', // in here we specify folder from which webpack should serve our files
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html', // starting html file
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // it testes all js files
        exclude: /node_modules/, // not test node modules folder js files :)
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
