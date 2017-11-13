import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Visualizer from 'webpack-visualizer-plugin';
import getTheme from '../utils/getTheme';
import getCSSLoaders from '../utils/getCSSLoaders';
import normalizeDefine from '../utils/normalizeDefine';
import getEntry from '../utils/entry';
import generateHtml from '../utils/html';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';

export default function (args, appBuild, config, paths) {
  const { debug, analyze } = args;
  const NODE_ENV = debug ? 'development' : process.env.NODE_ENV;

  const publicPath = config.publicPath || '/';
  const cssLoaders = getCSSLoaders(config);
  const theme = getTheme(process.cwd(), config);

  // 获取多页面的所有入口，每个入口文件名都为 index.js
  let configEntry = config.entry ? paths.appDirectory + '/' + config.entry : `${paths.appSrc}/pages/*/index.js`;
  let entries = getEntry(configEntry, config);
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
      chunkFilename: '[name].[chunkhash:8].chunk.js',
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
              publicPath: publicPath,              
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
                require.resolve('babel-preset-env'),
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders.own,
          }),
        },
        {
          test: /\.css$/,
          include: paths.appNodeModules,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders.nodeModules,
          }),
        },
        {
          test: /\.less$/,
          include: paths.appSrc,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              ...cssLoaders.own,
              {
                loader: 'less-loader',
                options: {
                  modifyVars: theme,
                },
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          include: paths.appNodeModules,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              ...cssLoaders.nodeModules,
              {
                loader: 'less-loader',
                options: {
                  modifyVars: theme,
                },
              },
            ],
          }),
        },
        {
          test: /\.scss/,
          include: paths.appSrc,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              ...cssLoaders.own,
              {
                loader: 'sass-loader',
                options: config.sassOptions,
              },
            ],
          }),
        },
        {
          test: /\.scss/,
          include: paths.appNodeModules,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              ...cssLoaders.nodeModules,
              {
                loader: 'sass-loader',
                options: config.sassOptions,
              },
            ],
          }),
        },
        {
          test: /\.(mp4|ogg|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
              publicPath: publicPath,
            }
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
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
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true,
      }),
    ]
      .concat(
        debug ? [] :
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
        generateHtml(entries)
      ),
    externals: config.externals || '',
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  };
}
