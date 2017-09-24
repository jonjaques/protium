#!/usr/bin/env node

require('ts-node/register')
const colors = require('colors')
const Path = require('path')
const PrettyError = require('pretty-error')
const yargs = require('yargs')
const Config = require('../src/lib/config').default
const DevTools = require('../src/lib/devtools').default
const config = new Config()
const errors = new PrettyError();
errors.start()

const desc = `                     __  .__
_____________  _____/  |_|__|__ __  _____
\\____ \\_  __ \\/  _ \\   __\\  |  |  \\/     \\
|  |_> >  | \\(  <_> )  | |  |  |  /  Y Y  \\
|   __/|__|   \\____/|__| |__|____/|__|_|  /
|__|                                    \\/`

const program = yargs
  .alias('help', 'h')
  .alias('config', 'c')
  .option('config', 'Path to config file', (path) => {
    return Path.resolve(path)
  })
  .demandCommand(1, colors.red('Plz tell me wat you want, $0, $1'))
  .usage(colors.green(desc) + '\n\n' + 'Usage: $0 [command] --option val')
  .epilogue(colors.grey('Issues: https://github.com/jonjaques/protium/issues'))
  .help()
  .command('build', 'Builds static files for your sites', (args) => {
    config.loadArgs(args)
    const devtools = new DevTools(config)
    devtools.build().then((stats) => {
      console.log(stats.toString())
    }).catch((err) => {
      console.log(err)
      args.showHelp()
    })
    return args
  })
  .command('dev', 'Builds static files for your sites', (args) => {
    config.loadArgs(args)
    const devtools = new DevTools(config)
    const watcher = devtools.watch()
    console.log(watcher)
    return args
  })
  .argv
