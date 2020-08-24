const { Users } = require("../models/User")
const { Guild } = require("../models/Guild")
module.exports = class Message {
    constructor (client) {
      this.client = client
    }
  
    async run (message) {
      if (message.author.bot) return
      if (!message.content.startsWith(this.client.prefix)) return
      const args = message.content.slice(this.client.prefix.length).trim().split(/ +/g)
      const command = args.shift().toLowerCase()
      const fancyCommand = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command))
      const requiredPermissions = fancyCommand.requiredPermissions
      if(message.channel.type === 'dm') return message.reply('Você não pode executar comandos na DM.')
      const user = await Users.findById(message.author.id)
      const guild = await Guild.findById(message.guild.id)
      if(!user) {
        const newUser = new Users({
          _id: message.author.id,
          subs: [],
          donator: false
        })
        newUser.save()
      }
      console.log("aaa")
      if(!guild) {
        const newGuild = new Guild({
          _id: message.guild.id,
          premiumGuild: false,
          channelMode: false,
          channelModeID: null,
          partner: false
        })
        newGuild.save()
      }
      if (fancyCommand.dev === true) {
        if (message.author.id !== process.env.BOT_OWNER_ID) {
          return message.reply('You do not have the required permissions to use this command.')
        }
      }
      if (requiredPermissions !== null) {
        if (!message.member.hasPermission(requiredPermissions)) {
          return message.reply('You do not have the required permissions to use this command.')
        }
      }
      try {
        new Promise((resolve) => { // eslint-disable-line no-new
          resolve(fancyCommand.run({ message, args }))
        })
      } catch (e) {
        console.log(e)
        message.reply(`Looks a fatal error! Send a screenshot of this to <@326123612153053184>\n\`${e.stack}\``)
      }
    }
  }
