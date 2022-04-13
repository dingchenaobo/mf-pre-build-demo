const path = require('path');
const webpack = require('webpack');

const writeRemote = require('./writeRemote.js');
const cachePath = path.join(process.cwd(), '.cache');

module.exports = async function prebuild({ dependencies }) {
  await writeRemote(dependencies);

  return;
  webpack({
    mode: 'development',
    devtool: false,
    entry: __dirname + '/prebuild.entry.js',
    output: {
      chunkLoadingGlobal: 'webpackJsonp',
      uniqueName: 'runtime',
      path: cachePath,
      library: {
        type: 'commonjs',
      }
    },
    optimization: {
      minimize: false,
      chunkIds: 'named',
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.container.ModuleFederationPlugin({
        name: 'mf-remote',
        filename: 'mf-remote.js',
        // exposes: remoteFiles.reduce((pre, cur) => {
        //   const { packageName, exposePath } = cur;
        //   pre[`./${packageName}`] = `./${exposePath}` || packageName;
        //   return pre;
        // }, {}),
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
