export default function getCSSLoaders(config) {
  const own = [];
  const nodeModules = [];
  const noCSSModules = [];

  const baseCSSOptions = {
    importLoaders: 1,
    sourceMap: !config.disableCSSSourceMap,
  };
  
  const ENV = process.env.NODE_ENV;
  if (ENV === 'production') {
    baseCSSOptions.minimize = true
  }

  if (config.disableCSSModules) {
    own.push({
      loader: 'css-loader',
      options: baseCSSOptions,
    });
  } else {
    own.push({
      loader: 'css-loader',
      options: {
        ...baseCSSOptions,
        modules: true,
        localIdentName: '[local]___[hash:base64:5]',
      },
    });
  }
  nodeModules.push({
    loader: 'css-loader',
    options: baseCSSOptions,
  });
  noCSSModules.push({
    loader: 'css-loader',
    options: baseCSSOptions,
  });

  const postcssLoader = {
    loader: 'postcss-loader',
  };

  noCSSModules.push(postcssLoader);
  own.push(postcssLoader);
  nodeModules.push(postcssLoader);

  return {
    own,
    nodeModules,
    noCSSModules,
  };
}
