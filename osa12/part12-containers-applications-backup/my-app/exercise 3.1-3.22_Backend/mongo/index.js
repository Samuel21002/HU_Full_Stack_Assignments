const mongoose = require('mongoose')
const Person = require('./models/Person')
const { MONGO_URL } = require('../util/config')

if (MONGO_URL && !mongoose.connection.readyState) {
  mongoose.set('strictQuery', false)
  mongoose.connect(MONGO_URL)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })
}

module.exports = {
  Person
}
