const path = require("path");
const merge = require("webpack-merge");
const validate = require("webpack-validator");
const parts = require('./wepack-loaders');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  css: path.join(__dirname, 'dist/css')
};
 