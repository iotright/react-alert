const path = require('path')
const execSync = require('child_process').execSync
const changeCase = require('change-case')

process.chdir(path.resolve(__dirname, '..'))

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv),
  })

const packageName = require('../package').name

console.log('\nBuilding CommonJS modules...')

exec(`rollup -c scripts/config.js -f cjs -o dist/cjs/${packageName}.js`)

console.log('\nBuilding ES modules...')

exec(`rollup -c scripts/config.js -f es -o dist/esm/${packageName}.js`)

console.log('\nBuilding UMD modules...')

exec(
  `rollup -c scripts/config.js -f umd -n ${changeCase.pascalCase(packageName)} -o dist/umd/${packageName}.js`,
  {
    BUILD_ENV: 'development',
  },
)

exec(
  `rollup -c scripts/config.js -f umd -n ${changeCase.pascalCase(packageName)} -o dist/umd/${packageName}.min.js`,
  {
    BUILD_ENV: 'production',
  },
)
