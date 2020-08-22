module.exports = class ready {
    constructor (client) {
      this.client = client
    }
    async run() {
        this.client.user.setActivity(`good night | sn!help | V.${require('../util/updates.json')[0].version}`)
    }
}