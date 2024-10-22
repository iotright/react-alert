const resolve = require('@rollup/plugin-node-resolve') // updated
const replace = require('@rollup/plugin-replace') // updated
const babel = require('@rollup/plugin-babel').babel // updated
const commonjs = require('@rollup/plugin-commonjs') // updated
const { uglify } = require('rollup-plugin-uglify') // remains the same

const getPlugins = (env) => {
  const plugins = [resolve()]

  if (env) {
    plugins.push(
      replace({
        preventAssignment: true, // recommended with new @rollup/plugin-replace
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
    )
  }

  plugins.push(
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled', // required for @rollup/plugin-babel
      presets: [
        ['@babel/preset-env', { modules: false }],
        '@babel/preset-react',
      ],
    }),
    commonjs({
      include: /node_modules/,
    }),
  )

  if (env === 'production') {
    plugins.push(uglify())
  }

  return plugins
}

const config = {
  input: 'src/index.js',
  output: {
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      'react-transition-group': 'ReactTransitionGroup',
    },
  },
  external: ['react', 'prop-types', 'react-dom', 'react-transition-group'],
  plugins: getPlugins(process.env.BUILD_ENV),
}

module.exports = config
