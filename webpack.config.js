/* eslint-disable @typescript-eslint/explicit-function-return-type */
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const spreadIf = (condition, toSpread) => {
  if (condition) {
    return toSpread;
  }

  if (Array.isArray(toSpread)) {
    return [];
  }
  if (typeof toSpread === 'object') {
    return {};
  }
  throw new Error('unknown spreadIf object: ' + toSpread);
};

const config = (env, args) => {
  console.log('Building project!');
  console.log('env:', env);
  console.log('args:', args);

  const isProd = args.mode === 'production';

  return {
    devtool: isProd ? 'source-map' : 'inline-source-map',
    entry: {
      FrameDataViewer: path.join(__dirname, './js/src/FrameDataViewer.tsx'),
      index: path.join(__dirname, './js/src/index.ts'),
    },
    mode: args.mode,
    module: {
      rules: [
        {
          test: /\.(ts)x?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    output: {
      path: path.join(__dirname, './js/dist'),
      filename: '[name].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        process: { env: {} },
      }),
    ],
    resolve: {
      ...spreadIf(!isProd, {
        alias: {
          react: path.resolve('./node_modules/react'),
          'styled-components': path.resolve('./node_modules/styled-components'),
        },
      }),
      extensions: ['.ts', '.js'],
      fallback: {
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
      },
    },
  };
};

module.exports = config;
