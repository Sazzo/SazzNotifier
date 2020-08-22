const { Command } = require('../structures/Command')
const Updates = require('../util/updates.json')
module.exports = class Changelog extends Command {
  constructor (client) {
    super(client, {
      name: 'changelog',
      aliases: [],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message }) {
    message.channel.send(`Last update:\n*${Updates[0].version} (${Updates[0].date})*\n**Author**: *${Updates[0].author}*\n**Changes:\n**${Updates[0].changes.toString().split(",").join("")}`)
  }
}