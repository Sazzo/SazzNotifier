const mongoose = require('mongoose')
const bluebird = require("bluebird")
module.exports = () => {
    const connect = () => {
        mongoose
        .connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
          return console.log(`Successfully connected.`);
        })
        .catch(error => {
          console.log("Error connecting to database: ", error);
          return process.exit(1);
        });
    }
    connect();
    mongoose.Promise = bluebird
    mongoose.connection.on("disconnected", connect);
}
