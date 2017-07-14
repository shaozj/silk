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
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
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
  let configEntry = config.entry ? paths.appDirectory+'/'+config.entry : `${paths.appSrc}/pages/*/index.js`;
  let entries = entry(configEntry, config);
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
            /\.(css|less|sass|scss|styl)$/,
            /\.json$/,
            /\.(mp4|ogg|svg)$/,
          ],
          loader: 'url',
          query: {
            limit: 10000,
            name: 'static/[name].[hash:8].[ext]',
            publicPath: publicPath
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
        {
          test: /\.sass/,
          include: paths.appSrc,
          loader: ExtractTextPlugin.extract('style',
            `${cssLoaders.own.join('!')}!sass?outputStyle=expanded&indentedSyntax`
          )
        },
        {
          test: /\.scss/,
          include: paths.appSrc,
          loader: ExtractTextPlugin.extract('style',
            `${cssLoaders.own.join('!')}!sass?outputStyle=expanded`
          )
        },
        {
          test: /\.styl/,
          include: paths.appSrc,
          loader: ExtractTextPlugin.extract('style',
            `${cssLoaders.own.join('!')}!stylus`
          )
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
            publicPath: publicPath
          },
        },
        {
          test: /\.(png|jpg|gif|woff|woff2)$/,
          loader: 'url-loader?limit=8192'
        },
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
          NODE_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        React: 'react',
        ReactDOM: 'react-dom'
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new ExtractTextPlugin('[name].css'),
    ]
      .concat(
        debug ? [] :
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     screw_ie8: true, // React doesn't support IE8
        //     warnings: false,
        //   },
        //   mangle: {
        //     screw_ie8: true,
        //   },
        //   output: {
        //     comments: false,
        //     screw_ie8: true,
        //   },
        // }),
        new ParallelUglifyPlugin({
          cacheDir: '.cache/', // 设置 cache 地址，加速压缩
          uglifyJS: {
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
            }
          }
        })
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
        (!config.multipage || config.noVendor) ? [] : // 或配置了 noVendor
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
