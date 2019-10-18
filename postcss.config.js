const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');

const purgecssPlugin = purgecss({
  content: ['./client/src/**/*.pug', './client/src/**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...(process.env.NODE_ENV === 'production' ? [purgecssPlugin] : [])
  ]
};
