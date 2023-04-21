// If you want to use other PostCSS plugins, see the following:
// https://tailwindcss.com/docs/using-with-preprocessors
const postcssNesting = require('postcss-nesting');

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
