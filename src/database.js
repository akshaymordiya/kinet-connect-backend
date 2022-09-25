const { default: mongoose } = require("mongoose");
const config = require("./config/config");

function connectDatabase() {
  mongoose.connect(config.mongoose.url, config.mongoose.options)

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', () => {
    console.log("DB Connected successfully..!");
  })
}

module.exports = {
  connectDatabase
}