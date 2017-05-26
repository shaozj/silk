import autoprefixer from 'autoprefixer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import SystemBellWebpackPlugin from 'system-bell-webpack-plugin';
import HappyPack from 'happypack';
import getPaths from '../utils/paths';
import getEntry from '../utils/getEntry';
import getTheme from '../utils/getTheme';
import getCSSLoaders from '../utils/getCSSLoaders';
import normalizeDefine from '../utils/normalizeDefine';
import generateHtml from '../utils/html';
import entry from '../utils/entry';
import path from 'path';

export default function (config, cwd) {
  const publicPath = '/';
  const cssLoaders = getCSSLoaders(config);
  const theme = JSON.stringify(getTheme(process.cwd(), config));
  const paths = getPaths(cwd);
  // 获取多页面的所有入口，每个入口文件名都为 index.js
  let configEntry = config.entry ? paths.appDirectory+'/'+config.entry : `${paths.appSrc}/pages/*/index.js`;
  let entries = entry(configEntry, config);
  // 添加mock数据入口
  if (fs.existsSync(`${paths.appSrc}/mock/mock.js`)) {
    entries['mock'] = [`${paths.appSrc}/mock/mock.js`];
  }
  //const entry = getEntry(config, paths.appDirectory);

  return {
    devtool: 'cheap-module-source-map',
    entry: entries,
    output: {
      path: paths.appBuild,
      filename: '[name].js',
      pathinfo: true,
      publicPath,
    },
    devServer: {
      disableHostCheck: true
    },
    resolve: {
      extensions: [
        '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
        '.js', '.json', '.jsx', '.ts', 'tsx', '',
      ],
      alias: {
        actions: `${paths.appSrc}/actions/`,
        components: `${paths.appSrc}/components/`,
        sources: `${paths.appSrc}/sources/`,
        stores: `${paths.appSrc}/stores/`,
        'react/lib/ReactMount': 'react-dom/lib/ReactMount'
      }
    },
    resolveLoader: {
      root: [
        paths.ownNodeModules,
        paths.appNodeModules,
      ],
      moduleTemplates: ['*-loader'],
    },
    module: {
      loaders: [
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx)$/,
            /\.(css|less|sass|scss|styl)$/,
            /\.json$/,
            /\.(mp4|ogg|svg)$/,
          ],
          loader: 'url',
          query: {
            limit: 10000,
            name: 'static/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(js|jsx)$/,
          include: paths.appSrc,
          loader: 'babel',
          // loader: path.resolve(__dirname, '../../node_modules', 'happypack/loader') + '?id=jsx',
        },
        {
          test: /\.css$/,
          include: paths.appSrc,
          loader: `style!${cssLoaders.own.join('!')}`,
        },
        {
          test: /\.less$/,
          include: paths.appSrc,
          loader: `style!${cssLoaders.own.join('!')}!less?{"modifyVars":${theme}}`,
        },
        {
          test: /\.css$/,
          include: paths.appNodeModules,
          loader: `style!${cssLoaders.nodeModules.join('!')}`,
        },
        {
          test: /\.less$/,
          include: paths.appNodeModules,
          loader: `style!${cssLoaders.nodeModules.join('!')}!less?{"modifyVars":${theme}}`,
        },
        {
          test: /\.sass$/,
          include: paths.appSrc,
          loader: `style!${cssLoaders.own.join('!')}!sass?outputStyle=expanded&indentedSyntax`
        },
        {
          test: /\.scss$/,
          include: paths.appSrc,
          loader: `style!${cssLoaders.own.join('!')}!sass?outputStyle=expanded`
        },
        {
          test: /\.styl$/,
          include: paths.appSrc,
          loader: `style!${cssLoaders.own.join('!')}!stylus`
        },
        {
          test: /\.json$/,
          loader: 'json',
        },
        {
          test: /\.(mp4|ogg|svg)$/,
          loader: 'file',
          query: {
            name: 'static/[name].[hash:8].[ext]',
          },
        }
      ],
    },
    babel: config.useBabelrc ? {} : {
      babelrc: false,
      presets: [
        require.resolve('babel-preset-es2015'),
        require.resolve('babel-preset-react'),
        require.resolve('babel-preset-stage-0'),
      ].concat(config.extraBabelPresets || []),
      plugins: [
        require.resolve('babel-plugin-add-module-exports'),
        require.resolve('babel-plugin-react-require')
      ].concat(config.extraBabelPlugins || []),
      cacheDirectory: true,
    },
    postcss() {
      return [
        autoprefixer(config.autoprefixer || {
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ],
        }),
      ]
        .concat(config.extraPostCSSPlugins ? config.extraPostCSSPlugins : []);
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        React: 'react',
        ReactDOM: 'react-dom'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      new SystemBellWebpackPlugin(),
      // new HappyPack({
      //   id: 'jsx',
      //   threads: 8,
      //   loaders: ['babel?' + JSON.stringify({
      //     babelrc: false,
      //     presets: [
      //       require.resolve('babel-preset-es2015'),
      //       require.resolve('babel-preset-react'),
      //       require.resolve('babel-preset-stage-0'),
      //     ],
      //     plugins: [
      //       require.resolve('babel-plugin-add-module-exports'),
      //       require.resolve('babel-plugin-react-require')
      //     ].concat(config.extraBabelPlugins || []),
      //     cacheDirectory: true,
      //   })]
      // }),
    ].concat(
      !fs.existsSync(paths.appPublic) ? [] :
        new CopyWebpackPlugin([
          {
            from: paths.appPublic,
            to: paths.appBuild,
          },
        ]),
    ).concat(
      ((!config.multipage || config.dll) && !config.vendor) ? [] :
        new webpack.optimize.CommonsChunkPlugin(
          {
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
          }),
    ).concat(
      !config.define ? [] :
        new webpack.DefinePlugin(normalizeDefine(config.define)),
    ).concat(
      generateHtml(entries)
    ).concat(
      !config.dll ? [] :
      new webpack.DllReferencePlugin({
        context: paths.appDirectory,
        manifest: require(path.join(paths.appPublic, 'vendor-manifest.json'))
      }),
    ),
    externals: config.externals,
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };
}
