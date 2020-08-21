const Parser = require('rss-parser')
const RssFeedEmitter = require('rss-feed-emitter-headers');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });
const { Anime } = require('../models/Anime')
module.exports.RSSFeed = class RSSFeed {
    constructor(client) {
        this.client = client
    }

    async listen(client) {
       feeder.add({
           url: 'https://cors-anywhere.herokuapp.com/https://www.crunchyroll.com/rss/anime',
           refresh: 20000
       })
       feeder.on('new-item', async function(item) {
        try {
            const animeTitle = item['crunchyroll:seriestitle']['#']
            const animeEpisode = item['crunchyroll:episodenumber']['#']
            const anime = await Anime.findById(animeTitle)
            const subtitleLang = item['crunchyroll:subtitlelanguages']
        if(!anime) {
            if(!subtitleLang['#'].includes('en')) return;
            const newAnime = new Anime({
                _id: animeTitle,
                rss: item.guid,
                users: [],
                lastEpisode: animeEpisode,
                sub: subtitleLang["#"]
            }) 
            newAnime.save()
            return;
        } else {
            if(animeEpisode < anime.lastEpisode) return;
            if(animeEpisode == anime.lastEpisode) return;
            anime.lastEpisode = animeEpisode
            anime.rss = item.guid
            anime.save()
            anime.users.forEach(user => {
                const toSend = client.users.cache.get(user)
                toSend.send(`It looks like a new episode of ${anime._id} just came out! Time to watch! ${anime.rss}`)
            });
        }
        } catch(e) {
            if(e.message.includes('#')) return;
            if(e.message.includes('duplicate')) return;
            console.log(e)
        }
       })
       feeder.on('error', console.error);
    }
}