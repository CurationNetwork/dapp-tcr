const webpack = require('webpack');
const path = require('path');

const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('webpack-dotenv-extended-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { getIfUtils, removeEmpty, propIf } = require('webpack-config-utils');

const HOST = 'localhost';
const PORT = 3000;

const sourcePath = path.resolve(__dirname);
const appPath = path.resolve(__dirname);
const buildPath = path.resolve(__dirname, 'build');

module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return removeEmpty({
    mode: env,

    entry: {
      app: removeEmpty([
        ifDevelopment(`webpack-dev-server/client?http://${HOST}:${PORT}`),
        ifDevelopment('webpack/hot/only-dev-server'),
        path.resolve(__dirname, './index.js'),
      ]),
    },

    output: {
      filename: 'static/js/[hash].bundle.js',
      chunkFilename: 'static/js/[name].bundle.js',  
      publicPath: '/',
      path: buildPath,
    },

    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },

    devtool: propIf(env === 'development', 'inline-source-map', 'cheap-source-map'),

    devServer: ifDevelopment({
      host: HOST,
      port: PORT,
      historyApiFallback: true,
      hot: true,
      clientLogLevel: "error",
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      }
    }),

    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        appPath,
        path.resolve(sourcePath, 'node_modules'),
      ],
    },

    node: {
      fs: 'empty'
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: appPath,
          use: {
            loader: 'babel-loader',
            options: removeEmpty({
              babelrc: false,
              presets: [
                ["@babel/preset-env", {"targets": {"browsers": ["> 1%", "last 2 versions"]}}],
                "@babel/preset-react"
              ],
              plugins: removeEmpty([
                ifDevelopment(["react-hot-loader/babel"]),
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                ["@babel/plugin-syntax-dynamic-import"],
              ]),
              cacheDirectory: ifDevelopment(true),
              compact: ifProduction(true),
            }),
          }
        },
        {
          test: /\.(css|scss)$/,
          use: removeEmpty([
            ifProduction(MiniCssExtractPlugin.loader),
            ifDevelopment('style-loader'),
            {
              loader: 'css-loader',
              options: ifDevelopment({sourceMap: true}),
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                })],
              }
            },
            {
              loader: 'sass-loader',
              options: ifDevelopment({sourceMap: true}),
            },
          ])
        },
        {
          test: /\.(jpg|jpeg|gif|png|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 8192,
            fallback: 'file-loader',
            name: '[name].[ext]',
            outputPath: 'static/img/',
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'static/fonts/',
            name: '[name].[ext]'
          }
        },
        {
          test: /\.md$/,
          loader: 'file-loader',
          options: {
            outputPath: 'static/md/',
            name: '[name].[ext]'
          }
        }
      ]
    },

    plugins: removeEmpty([
      ifDevelopment(new CaseSensitivePathsWebpackPlugin()),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifProduction(new CleanWebpackPlugin(buildPath)),
      ifProduction(new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: { comments: false },
          compress: { drop_console: true }
        }
      })),
      ifProduction(new OptimizeCSSAssetsPlugin({})),
      new MiniCssExtractPlugin({
        filename: 'static/css/bundle-[hash].css'
      }),
      new HtmlWebpackPlugin({
        path: buildPath,
        hash: true,
        template: path.resolve(appPath, 'index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new DotenvPlugin({
        defaults: './config/.env.default',
        path: './config/.env.local'
      }),
      // new CopyWebpackPlugin([
      //   {
      //     from: 'src/assets/favicons',
      //     to: 'static/favicons',
      //     toType: 'dir'
      //   },
      // ])
    ])
  });
};
