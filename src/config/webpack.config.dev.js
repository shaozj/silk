import autoprefixer from 'autoprefixer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import SystemBellWebpackPlugin from 'system-bell-webpack-plugin';
import getPaths from '../utils/paths';
import getTheme from '../utils/getTheme';
import getCSSLoaders from '../utils/getCSSLoaders';
import normalizeDefine from '../utils/normalizeDefine';
import getEntry from '../utils/entry';
import generateHtml from '../utils/html';
import path from 'path';

export default function (config, cwd) {
  const publicPath = config.localPublicPath || '/';
  const cssLoaders = getCSSLoaders(config);
  const theme = getTheme(process.cwd(), config);
  const paths = getPaths(cwd);
  // 获取多页面的所有入口，每个入口文件名默认为 index.js
  let configEntry = config.entry ? paths.appDirectory + '/' + config.entry : `${paths.appSrc}/pages/*/index.js`;
  let entries = getEntry(configEntry, config);
  // 添加 mock 数据入口
  if (fs.existsSync(`${paths.appSrc}/mock/mock.js`)) {
    entries['mock'] = [`${paths.appSrc}/mock/mock.js`];
  }

  return {
    devtool: 'cheap-module-source-map',
    entry: entries,
    output: {
      path: paths.appBuild,
      filename: '[name].js',
      pathinfo: true,
      publicPath,
      chunkFilename: '[name].chunk.js',
    },
    devServer: {
      disableHostCheck: true
    },
    resolve: {
      extensions: [
        '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
        '.js', '.json', '.jsx', '.ts', 'tsx',
      ],
      alias: {
        components: `${paths.appSrc}/components/`,
        containers: `${paths.appSrc}/containers/`,
        utils: `${paths.appSrc}/utils/`,
        mods: `${paths.appSrc}/mods/`,
        images: `${paths.appSrc}/images/`,
        'react/lib/ReactMount': 'react-dom/lib/ReactMount',
      },
    },
    resolveLoader: {
      modules: [
        paths.ownNodeModules,
        paths.appNodeModules,
      ],
    },
    module: {
      rules: [
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx)$/,
            /\.(css|less|sass|scss|styl)$/,
            /\.json$/,
            /\.(mp4|ogg|svg)$/,
          ],
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/[name].[ext]',
            },
          },
        },
        {
          test: /\.(js|jsx)$/,
          include: paths.appSrc,
          use: {
            loader: 'babel-loader',
            options: config.useBabelrc ? {} : {
              babelrc: false,
              presets: [
                [require.resolve('babel-preset-env'), {"modules": false}],
                require.resolve('babel-preset-react'),
                require.resolve('babel-preset-stage-0'),
              ].concat(config.extraBabelPresets || []),
              plugins: [
                require.resolve('babel-plugin-add-module-exports'),
                require.resolve('babel-plugin-react-require'),
                require.resolve('babel-plugin-syntax-dynamic-import')
              ].concat(config.extraBabelPlugins || []),
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.css$/,
          include: paths.appSrc,
          use: [
            'style-loader',
            ...cssLoaders.own,
          ]
        },
        {
          test: /\.css$/,
          include: paths.appNodeModules,
          use: [
            'style-loader',
            ...cssLoaders.nodeModules,
          ],
        },
        {
          test: /\.less$/,
          include: paths.appSrc,
          use: [
            'style-loader',
            ...cssLoaders.own,
            {
              loader: 'less-loader',
              options: {
                modifyVars: theme,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          include: paths.appNodeModules,
          use: [
            'style-loader',
            ...cssLoaders.nodeModules,
            {
              loader: 'less-loader',
              options: {
                modifyVars: theme,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          include: paths.appSrc,
          use: [
            'style-loader',
            ...cssLoaders.own,
            {
              loader: 'sass-loader',
              options: config.sassOptions,
            },
          ],
        },
        {
          test: /\.scss$/,
          include: paths.appNodeModules,
          use: [
            'style-loader',
            ...cssLoaders.nodeModules,
            {
              loader: 'sass-loader',
              options: config.sassOptions,
            },
          ],
        },
        {
          test: /\.(mp4|ogg|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
            },
          },
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      new SystemBellWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
        ...(!config.define ? {} : normalizeDefine(config.define))
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        React: 'react',
        ReactDOM: 'react-dom'
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          postcss: [
            autoprefixer(config.autoprefixer || {
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
            }),
            ...(config.extraPostCSSPlugins ? config.extraPostCSSPlugins : []),
          ],
        },
      }),
    ].concat(
      !fs.existsSync(paths.appPublic) ? [] :
        new CopyWebpackPlugin([
          {
            from: paths.appPublic,
            to: paths.appBuild,
          },
        ]),
    ).concat(
      (!config.multipage || config.dll || config.noVendor) ? [] :
        new webpack.optimize.CommonsChunkPlugin(
          {
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
          }),
    ).concat(
      generateHtml(entries)
    ).concat(
      !config.dll ? [] :
      new webpack.DllReferencePlugin({
        context: paths.appDirectory,
        manifest: require(path.join(paths.appPublic, 'vendor-manifest.json'))
      }),
    ),
    externals: config.externals || '',
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };
}
