const { Command } = require('../structures/Command')
const { Users } = require("../models/User")
const { MessageEmbed } = require("discord.js")
module.exports = class SubList extends Command {
  constructor (client) {
    super(client, {
      name: 'subscribelist',
      aliases: ["sublist"],
      requiredPermissions: null,
      dev: false
    })
    this.client = client
  }

  async run ({ message }) {
    const user = await Users.findById(message.author.id)
    let list = user.subs.toString().split(",").join("\n")
    if(list === "") {
        list = "None"
    }
    const embed = new MessageEmbed()
    .setTitle("Subscription list")
    .setColor("#5e90d1")
    .addField("Animes:", `${list}`, true)
    message.channel.send(embed)
  }
}