const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
// const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  style: {
    postcssOptions: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  webpack: {
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      // new CircularDependencyPlugin({
      //   // exclude detection of files based on a RegExp
      //   exclude: /a\.js|node_modules/,
      //   // add errors to webpack instead of warnings
      //   failOnError: false,
      //   // allow import cycles that include an asyncronous import,
      //   // e.g. via import(/* webpackMode: "weak" */ './file.js')
      //   allowAsyncCycles: false,
      //   // set the current working directory for displaying module paths
      //   cwd: process.cwd()
      // })
    ]
  }
};
