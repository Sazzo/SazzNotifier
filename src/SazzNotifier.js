const { Client, Collection } = require('discord.js')
const { readdir } = require('fs')
const connect = require('./db')
const { RSSFeed } = require('./services/RSSFeed')
module.exports.SazzNotifier = class SazzNotifier extends Client {
  constructor (token, options) {
    super(token)
    this.token = token
    this.prefix = options.prefix
    this.commands = new Collection()
  }

  async start () {
    await this.loadCommands()
    console.log('Loaded Commands.')
    await this.loadListeners()
    await connect()
    const RSS = new RSSFeed(this)
    // RSS.listen(this)
    console.log('Loaded Listeners.')
    await this.login(this.token)
      .then(() => console.log('Logged.'))
  }

  loadCommands () {
    readdir(`${__dirname}/commands`, (err) => {
      if (err) console.error(err)
      readdir(`${__dirname}/commands/`, (err, cmd) => {
        if (err) return console.log(err)
        cmd.forEach(cmd => {
          const command = new (require(`${__dirname}/commands/${cmd}`))(this)
          command.dir = `./src/commands/${cmd}`
          this.commands.set(command.name, command)
          command.aliases.forEach(a => this.aliases.set(a, command.name))
        })
      })
    })
  }

  loadListeners () {
    readdir(`${__dirname}/listeners`, (err, files) => {
      if (err) console.error(err)
      files.forEach(async em => {

        const Event = require(`${__dirname}/listeners/${em}`)
        const eventa = new Event(this)
        const name = em.split('.')[0]
        super.on(name, (...args) => eventa.run(...args))
      })
    })
  }
}