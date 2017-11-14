// This file is a configuration file for Webpack to 
//    1. Built development server to test front-end code
//    2. Compile front-end javascripts into single bundle.js and  
//        css files into style.bundle.css for production. 

// When it is built properly, a folder ./dist should be appeared) 

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); 

// Constant with our paths
const paths = {
  BUILD: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),  
};

// Webpack configuration
module.exports = {

  entry: path.join(paths.SRC, 'index.js'),
  output: {
    path: paths.BUILD,
    filename: 'bundle.js',
    publicPath: '/',    
  },

  // Tell webpack to use html plugin
  plugins: [
    new HtmlWebpackPlugin({template: path.join(paths.SRC, 'index.html'),}),
    new ExtractTextPlugin('style.bundle.css'),   // CSS will be extracted to this bundle file  
  ],

  // Loaders configuration
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,        
        loader: 'babel-loader',
        query: {
          "presets": ["es2015", "stage-0", "react"]
        },    
      },
      
      // CSS loader to CSS files 
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader?url=false',
        }),
      },

      {
        test: /\.(png|jpg)$/, 
        loader: 'file-loader', 
      }
    ],
  },
  // Enable importing JS files without specifying their's extenstion
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};