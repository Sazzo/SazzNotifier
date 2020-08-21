const { Command } = require('../structures/Command')
const { Anime } = require("../models/Anime")
module.exports = class Unsubscribe extends Command {
  constructor (client) {
    super(client, {
      name: 'unsub',
      aliases: [],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message, args }) {
    const specificAnime = args.slice(0).join(' ')
    const anime = await Anime.findById(specificAnime)
    if(!anime) return message.reply("It looks like I didn't find this anime, remember, always use the exact name that is on Crunchyroll.")
    const toRemove = anime.users.indexOf(message.author.id)
    if(toRemove > -1) {
      anime.users.splice(toRemove, 1)
      anime.save()
      message.reply(`Now you will no longer receive new notifications from ${anime._id}`)
    } else {
      message.reply('It looks like you are not subscribed to receive new notifications for this anime.')
    }
  }
}