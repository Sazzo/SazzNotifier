const { Command } = require('../structures/Command')
const { Anime } = require('../models/Anime')
const axios = require("axios")
module.exports = class Sub extends Command {
  constructor (client) {
    super(client, {
      name: 'sub',
      aliases: [],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message, args }) {
    const animeToSub = args.slice(0).join(' ')
    try {
         const query = `
            query {
                Media(search: "${animeToSub}", format: TV) {
                  id,
                     type,
                     title {
                       romaji
                       english
                       native
                       userPreferred
                  },
                  externalLinks {
                    site
                  }
                }
              }
            `
            const options = {
                url: "https://graphql.anilist.co",
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                },
                data: JSON.stringify({
                    query: query
                })
            }
            const response = await axios(options)
            const streamingLinks = response.data.data.Media.externalLinks
            const anime = await Anime.findById(response.data.data.Media.title.english)
            if(anime) {
               if(anime.users.includes(message.author.id)) return message.reply("You are already subscribed to receive notifications for this anime!")
               const m2 = message.author.send(`Hello **${message.author.username}**!\nFrom now on you will receive notification whenever a new episode of **${anime._id}** comes out on Crunchyroll!`)
               anime.users.push(message.author.id)
               anime.save()
               message.reply(`Now you will always be notified when a new episode of ${response.data.data.Media.title.english} comes out on Crunchyroll! You should receive a message in your DM now, otherwise, you don't have it open.`)
               return              
            }
            
           streamingLinks.forEach(site => {
            if(site.site === "Crunchyroll") { 
              const newAnime = new Anime({
                _id: response.data.data.Media.title.english,
                rss: null,
                users: [message.author.id],
                lastEpisode: 0,
                sub: null
              })
              newAnime.save()
              const m1 = message.author.send(`Hello **${message.author.username}**!\nFrom now on you will receive notification whenever a new episode of **${animeToSub}** comes out on Crunchyroll!`)
              message.reply(`Woah! It looks like you found a new anime that is not in the database! Congratulations! Now you will always be notified when a new episode of ${response.data.data.Media.title.english} comes out on Crunchyroll! You should receive a message in your DM now, otherwise, you don't have it open.`)
              return;
            }
            if(!site.site === "Crunchyroll") return message.reply("Oopsie! It looks like this anime is not available on Crunchyroll.")
           });
          
    } catch(e) {
        if(e.response === undefined) return console.error(e)
        if(e.response.status === 404) return message.reply('This anime was not found in Anilist database.')
    }
    
  }
}