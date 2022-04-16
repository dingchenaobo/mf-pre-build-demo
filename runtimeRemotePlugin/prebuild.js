const path = require('path');
const webpack = require('webpack');

const writeRemote = require('./writeRemote.js');

module.exports = async function prebuild({ dependencies, options }) {
  const exposes = await writeRemote(dependencies);

  webpack({
    mode: 'development',
    devtool: false,
    entry: __dirname + '/prebuild.entry.js',
    output: {
      chunkLoadingGlobal: 'webpackJsonp',
      uniqueName: 'runtime',
      path: path.join(__dirname, 'remoteRuntime'),
      library: {
        type: 'commonjs',
      }
    },
    optimization: {
      minimize: false,
      chunkIds: 'named',
    },
    module: options.module,
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.container.ModuleFederationPlugin({
        name: 'mf-remote',
        filename: 'mf-remote.js',
        exposes: exposes.reduce((r, item) => {
          r[item.packageName] = item.exposePath;
          return r;
        }, {}),
        shared: [
          'react',
          'react-dom',
          'react-router',
          'react-router-dom',
        ],
      }),
    ]
  }, (error, stats) => {
    if (error || stats.hasErrors()) {
      return console.error(stats.toJson({
        all: false,
        errors: true,
        warnings: true,
        timings: true,
      }));
    }
  });
}
