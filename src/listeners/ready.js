module.exports = class ready {
    constructor (client) {
      this.client = client
    }
    async run() {
        this.client.user.setActivity(`good night | V.${require('../../package.json').version}`)
    }
}