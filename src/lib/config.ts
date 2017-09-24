import * as findUp from 'find-up'
import * as Fs from 'fs'
import {extensions} from 'interpret'
import {get, set} from 'lodash'
import * as Path from 'path'
import * as Yargs from 'yargs'

export interface IProtiumConfig {

}

export default class Config {

  private settings = {}

  constructor(...args: any[]) {
    this.loadConfig(this.findConfigFile())
  }

  public get(key: string) {
    return get(this.settings, key)
  }

  public set(key: string, value: any) {
    return set(this.settings, key, value)
  }

  public loadConfig(configFile: string | null) {
    if (!configFile || !Fs.existsSync(configFile)) {
      throw new Error('Unable to find config file')
    }
    this.patchEnvForConfigFile(configFile)
    const module = interopRequire(require(configFile)).default

    if (!module || Array.isArray(module) || !Object.keys(module).length) {
      throw new Error('Must return an object as config')
    }

    Object.keys(module).forEach((key) => {
      this.set(key, module[key])
    })
  }

  public loadArgs(args: Yargs.Argv) {
    const opts = {...args.argv}
    delete opts._
    delete opts['$0'] // tslint:disable-line
    delete opts.help
    Object.keys(opts).forEach((key) => {
      this.set(key, opts[key])
    })
  }

  private findConfigFile() {
    const files = Object.keys(extensions).map((ext) => {
      return `protiumfile${ext}`
    })
    return findUp.sync(files)
  }

  private patchEnvForConfigFile(configFile: string) {
    const extMap = Object.keys(extensions).reduce((m, ext) => {
      if (ext === Path.extname(configFile)) {
        return extensions[ext]
      }
      return m
    }, null)

    return requireExtension(extMap)

    function requireExtension(item: any): void {
      try {
        if (!item) {
          // do nothing
        } else if (typeof item === 'string') {
          return require(item)
        } else if (typeof item === 'object' && !Array.isArray(item)) {
          const mod = require(item.module)
          return mod(item.register)
        } else if (Array.isArray(item)) {
          for (const i of item) {
            return requireExtension(i)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

}

function interopRequire(mod: any) {
  return mod && mod.__esModule ? mod : {default: mod}
}
