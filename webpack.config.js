/* global require, module, __dirname */
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin');

const glob = require('glob');
const sassArray = glob.sync('./src/scss/shepherd-*.scss');
const sassEntries = sassArray.reduce((acc, item) => {
  const name = item.replace('.scss', '').replace('./src/', '');
  acc[name] = item;
  return acc;
}, {});

// Theme SCSS files
sassEntries['css/welcome'] = './docs/welcome/scss/welcome.scss';

module.exports = [{
  entry: sassEntries,
  output: {
    // This is necessary for webpack to compile
    // But we never use removable-style-bundle.js
    filename: 'removable-[id]-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.s[c|a]ss$/,
        include: [
          path.resolve(__dirname, 'src/scss')
        ],
        exclude: [
          path.resolve(__dirname, 'docs/welcome/scss')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css'
            }
          },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({ grid: false })]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /welcome\.s[c|a]ss$/,
        include: [
          path.resolve(__dirname, 'docs/welcome/scss')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../docs/welcome/',
              name: 'css/[name].css'
            }
          },
          { loader: 'extract-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: () => [
                autoprefixer({
                  grid: false,
                  browsers: [
                    'last 2 versions'
                  ]
                })]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new StyleLintWebpackPlugin({
      fix: false,
      syntax: 'scss',
      quiet: false
    }),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        watch: true,
        port: 3000,
        notify: false,
        open: true,
        server: {
          baseDir: 'docs/welcome',
          routes: {
            '/shepherd/dist/js/shepherd.js': 'dist/js/shepherd.js',
            '/shepherd/docs/welcome/js/prism.js': 'docs/welcome/js/prism.js',
            '/shepherd/docs/welcome/js/welcome.js': 'docs/welcome/js/welcome.js',
            '/shepherd/docs/welcome/css/prism.css': 'docs/welcome/css/prism.css',
            '/shepherd/docs/welcome/css/welcome.css': 'docs/welcome/css/welcome.css',
            '/shepherd/docs/welcome/sheep.svg': 'docs/welcome/sheep.svg'
          }
        }
      }, {
        reload: true
      }
    )
  ]
}];
