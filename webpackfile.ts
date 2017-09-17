
import * as Path from 'path'
import * as Webpack from 'webpack'

module.exports = [
  build('browser'),
  build('server'),
]

function build(target = 'browser') {
  const BROWSER = target === 'browser'
  const SERVER = !BROWSER

  const context = Path.resolve('src/client')
  const entry = {
    browser: ['./index'],
  }

  const output = {
    filename: '[name].js',
    path: Path.resolve('dist'),
  }

  if (SERVER) {
  }

  return {
    context,
    entry,
    output
  }
}
