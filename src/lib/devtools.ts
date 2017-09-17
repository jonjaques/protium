import * as debug   from 'debug'
import * as Express from 'express'
import {map}        from 'lodash'
import * as Tapable from 'tapable'
import * as Webpack from 'webpack'

interface IDevToolsOptions {
  devtools: boolean,
  stats?: Webpack.Stats.ToStringOptionsObject | Webpack.Stats.ToJsonOptionsObject,
  webpack(config: Webpack.Configuration): Webpack.Configuration,
}

type DevToolsWatchOptions = Webpack.Compiler.WatchOptions
type DevToolsWatcher = Webpack.Compiler.Watching
type DevToolsStats = Webpack.Stats

const log = debug('protium:devtools')
const PRODUCTION = process.env.NODE_ENV === 'production'

export default class DevTools {

  protected static defaults: IDevToolsOptions = {
    devtools: PRODUCTION,
    webpack(config: Webpack.Configuration) { return config },
  }

  private options: IDevToolsOptions
  private compiler: Webpack.Compiler

  constructor(options?: IDevToolsOptions) {
    this.options = {...DevTools.defaults, ...options}
    this.compiler = Webpack(this.compilerConfig())
  }

  public build(): Promise<DevToolsStats> {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        if (err) {
          return reject(err)
        }
        PRODUCTION
          ? log('Build completed successfully')
          : log(stats.toString(this.options.stats))

        resolve(stats)
      })
    })
  }

  public middleware() {

  }

  public watch(options: DevToolsWatchOptions): DevToolsWatcher  {
    return this.compiler.watch(options, (err, stats) => {
      log(err || stats.toString())
    })
  }

  private compilerConfig() {
    const config: Webpack.Configuration = {
      entry: [],
      output: {},
    }
    return this.options.webpack(config)
  }
}
