const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MFRemotePlugin = require('./mf.remote.plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            }
          }
        ],
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ]
          }
        }
      }
    ]
  },
  devServer: {
    port: 3000,
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
    }),
    new MFRemotePlugin(),
  ]
};
