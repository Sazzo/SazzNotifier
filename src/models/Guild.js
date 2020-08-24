const mongoose = require('mongoose')

const GuildSchema = new mongoose.Schema({
    _id: String,
    premiumGuild: Boolean,
    channelMode: Boolean,
    channelModeID: String,
    partner: Boolean
})

const Guild = mongoose.model("Guild", GuildSchema)
module.exports.Guild = Guild