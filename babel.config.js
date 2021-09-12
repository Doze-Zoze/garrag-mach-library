// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  let presets = [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ];

  if (api.env('production')) {
  } else {
  }

  return {
    plugins: [
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      [
        'babel-plugin-styled-components',
        { ssr: false, displayName: false, namespace: 'sc' }, // See https://github.com/styled-components/jest-styled-components/issues/294#issuecomment-708947821
      ],
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets,
  };
};
