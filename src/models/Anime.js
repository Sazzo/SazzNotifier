const mongoose = require('mongoose')

const AnimeSchema = new mongoose.Schema({
    _id: String,
    rss: String,
    users: Array,
    lastEpisode: String,
    sub: String
})

const Anime = mongoose.model("Anime", AnimeSchema)
module.exports.Anime = Anime