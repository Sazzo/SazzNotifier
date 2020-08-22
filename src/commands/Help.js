const { Command } = require('../structures/Command')

module.exports = class Help extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      aliases: [],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message }) {
    message.channel.send("Hello! My name is Sazz Notifier and I will probably be your helper to notify new episodes of your favorite animes, I was created by <@326123612153053184> so you don't have to waste your time reloading pages or clicking on new links just to see if a new one episode has already come out. Here are my commands:\n\`sn!subscribe <Name> (or sn!sub)\`: Subscribe to receive notifications of new episodes of an anime specifically.\n\`sn!unsubscribe <Name> (or sn!unsub)\`: Unsubscribe to stop receiving notifications for a specific anime.\n\`sn!changelog\`: See the changelog duh.")
  }
}