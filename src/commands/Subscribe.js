const { Command } = require('../structures/Command')
const { Anime } = require('../models/Anime')
const { Users } = require("../models/User")
const mongoose = require("mongoose")
const axios = require("axios")
const { User } = require('discord.js')
module.exports = class Sub extends Command {
  constructor (client) {
    super(client, {
      name: 'sub',
      aliases: ["subscribe"],
      requiredPermissions: null,
      dev: false
    })
  }

  async run ({ message, args }) {
    const animeToSub = args.slice(0).join(' ')
    if(!animeToSub) return message.reply("You need to specify an anime name.")
    // mongoose.Promise = require("bluebird")
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
            const anime = await Anime.findById(`${response.data.data.Media.title.english === null ? response.data.data.Media.title.userPreferred : response.data.data.Media.title.english}`)
            const user = await Users.findById(message.author.id)
            if(!user) return message.reply("Use the command again.")
            if(anime) {
               if(anime.users.includes(message.author.id)) return message.reply("You are already subscribed to receive notifications for this anime!")
               const m2 = message.author.send(`Hello **${message.author.username}**!\nFrom now on you will receive notification whenever a new episode of **${anime._id}** comes out on Crunchyroll!`)
               anime.users.push(message.author.id)
               anime.save()
               user.subs.push(anime._id)
               user.save()
               message.reply(`Now you will always be notified when a new episode of ${anime._id} comes out on Crunchyroll! You should receive a message in your DM now, otherwise, you don't have it open.`)
               return              
            }
            const foundCr = streamingLinks.find(s => s.site === "Crunchyroll")
            if(foundCr != undefined) {
              const newAnime = new Anime({
                _id: `${response.data.data.Media.title.english === null ? response.data.data.Media.title.userPreferred : response.data.data.Media.title.english}`,
                rss: null,
                users: [message.author.id],
                lastEpisode: 0,
                sub: null
              })
              
              newAnime.save().then((err) => {
                user.subs.push(newAnime._id)
                user.save()
                const m1 = message.author.send(`Hello **${message.author.username}**!\nFrom now on you will receive notification whenever a new episode of **${newAnime._id}** comes out on Crunchyroll!`)
                message.reply(`Woah! It looks like you found a new anime that is not in the database! Congratulations! Now you will always be notified when a new episode of ${newAnime._id} comes out on Crunchyroll! You should receive a message in your DM now, otherwise, you don't have it open.`)
              })
              return;
            } else {
              message.reply("Oopsie! It looks like this anime is not available on Crunchyroll.")
            }
    } catch(e) {
        if(e.response === undefined) return console.error(e)
        if(e.response.status === 404) return message.reply('This anime was not found in Anilist database.')
    }
    
  }
}