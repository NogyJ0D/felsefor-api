const mongoose = require('mongoose')
const config = require('.')

const connection = async () => {
  await mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/${config.dbName}`)
  console.log('Mongo DB connected')
}

module.exports = { connection, mongoose }
