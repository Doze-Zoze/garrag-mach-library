/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const config = (env, args) => {
  console.log('Building project!');
  console.log('env:', env);
  console.log('args:', args);

  const isProd = args.mode === 'production';

  return {
    devtool: isProd ? 'source-map' : 'inline-source-map',
    entry: path.join(__dirname, './js/src/index.ts'),
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
    plugins: [new CleanWebpackPlugin()],
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
};

module.exports = config;
