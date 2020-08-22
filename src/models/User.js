const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    _id: String,
    subs: Array,
    donator: Boolean
})

const Users = mongoose.model("Users", UserSchema)
module.exports.Users = Users