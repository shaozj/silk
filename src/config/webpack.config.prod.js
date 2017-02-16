import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Visualizer from 'webpack-visualizer-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import getEntry from '../utils/getEntry';
import getTheme from '../utils/getTheme';
import getCSSLoaders from '../utils/getCSSLoaders';
import normalizeDefine from '../utils/normalizeDefine';
import entry from '../utils/entry';
import generateHtml from '../utils/html';

export default function (args, appBuild, config, paths) {
  const { debug, analyze } = args;
  const NODE_ENV = debug ? 'development' : process.env.NODE_ENV;

  const publicPath = config.publicPath || '/';
  const cssLoaders = getCSSLoaders(config);
  const theme = JSON.stringify(getTheme(process.cwd(), config));
  // const entries = getEntry(config, paths.appDirectory)

  // 获取多页面的所有入口，每个入口文件名都为 index.js
  let entries = entry(`${paths.appSrc}/pages/*/index.js`);
  // 用户配置入口，以 devEntry 优先级最高
  let configEntry = config.entry;
  if (configEntry) {
    entries = entry(paths.appDirectory+'/'+configEntry);
  }
  // 添加mock数据入口
  if (fs.existsSync(`${paths.appSrc}/mock/mock.js`)) {
    entries['mock'] = [`${paths.appSrc}/mock/mock.js`];
  }

  return {
    bail: true,
    entry: entries,
    output: {
      path: appBuild,
      filename: '[name].js',
      publicPath,
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
            /\.(css|less)$/,
            /\.json$/,
            /\.svg$/,
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
        },
        {
          test: /\.css$/,
          include: paths.appSrc,
          loader: ExtractTextPlugin.extract(
            'style',
            cssLoaders.own.join('!'),
          ),
        },
        {
          test: /\.less$/,
          include: paths.appSrc,
          loader: ExtractTextPlugin.extract(
            'style',
            `${cssLoaders.own.join('!')}!less?{"modifyVars":${theme}}`,
          ),
        },
        {
          test: /\.css$/,
          include: paths.appNodeModules,
          loader: ExtractTextPlugin.extract(
            'style',
            cssLoaders.nodeModules.join('!'),
          ),
        },
        {
          test: /\.less$/,
          include: paths.appNodeModules,
          loader: ExtractTextPlugin.extract(
            'style',
            `${cssLoaders.nodeModules.join('!')}!less?{"modifyVars":${theme}}`,
          ),
        },
        // {
        //   test: /\.html$/,
        //   loader: 'file?name=[name].[ext]',
        // },
        {
          test: /\.json$/,
          loader: 'json',
        },
        {
          test: /\.svg$/,
          loader: 'file',
          query: {
            name: 'static/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    babel: {
      presets: [
        require.resolve('babel-preset-es2015'),
        require.resolve('babel-preset-react'),
        require.resolve('babel-preset-stage-0'),
      ],
      plugins: [
        require.resolve('babel-plugin-add-module-exports'),
        require.resolve('babel-plugin-react-require'),
        ["import", { "libraryName": "antd", "libraryDirectory": "lib", "style": "css" }]
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
          NODE_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new webpack.ProvidePlugin({
        //$: 'jquery', // 使jquery变成全局变量,不用在自己文件require('jquery')了
        jQuery: 'jquery',
        React: 'react',
        ReactDOM: 'react-dom'
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new ExtractTextPlugin('[name].css'),
    ]
      .concat(
        debug ? [] : new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true, // React doesn't support IE8
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
      )
      .concat(
        analyze ? new Visualizer() : [],
      )
      .concat(
        !fs.existsSync(paths.appPublic) ? [] :
          new CopyWebpackPlugin([
            {
              from: paths.appPublic,
              to: paths.appBuild,
            },
          ]),
      )
      .concat(
        !config.multipage ? [] :
        new webpack.optimize.CommonsChunkPlugin(
          {
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
          }),
      )
      .concat(
        !config.define ? [] :
          new webpack.DefinePlugin(normalizeDefine(config.define)),
      ).concat(
        generateHtml(entries)
      ),
    externals: config.externals,
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };
}
