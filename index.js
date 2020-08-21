const { SazzNotifier } = require('./src/SazzNotifier')
require('dotenv').config()
const client = new SazzNotifier(process.env.TOKEN, {
    prefix: process.env.BOT_PREFIX
})
client.start()