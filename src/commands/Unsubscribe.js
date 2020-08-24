const { Command } = require('../structures/Command')
const { Anime } = require("../models/Anime")
const { Users } = require("../models/User")
module.exports = class Unsubscribe extends Command {
  constructor (client) {
    super(client, {
      name: 'unsub',
      aliases: ["unsubscribe"],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message, args }) {
    const specificAnime = args.slice(0).join(' ')
    if(!specificAnime) return message.reply("You need to specify an anime name.")
    const anime = await Anime.findById(specificAnime)
    const user = await Users.findById(message.author.id)
    if(!user) return message.reply("Use the command again.")
    if(!anime) return message.reply("It looks like I didn't find this anime, remember, always use the exact name that is on Crunchyroll.")
    const toRemove = anime.users.indexOf(message.author.id)
    const toRemoveInUser = user.subs.indexOf(specificAnime)
    if(toRemoveInUser > -1 || toRemove > -1) {
      if(toRemoveInUser > -1) {
        user.subs.splice(toRemoveInUser, 1)
        user.save()
      }
      if(toRemove > -1) {
        anime.users.splice(toRemove, 1)
        anime.save()
      }
      message.reply(`Now you will no longer receive new notifications from ${anime._id}`)
    } else {
      message.reply('It looks like you are not subscribed to receive new notifications for this anime.')
      return
    }
    
  }
}