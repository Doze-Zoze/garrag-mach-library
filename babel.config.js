// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  let presets = ['@babel/preset-env', '@babel/preset-typescript'];

  if (api.env('production')) {
  } else {
  }

  return {
    plugins: [
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets,
  };
};
