require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_CONF

if (process.env.NODE_ENV === 'test') {
  console.warn('Using test database')
  MONGODB_CONF = process.env.TEST_MONGODB_URI
} else {
  MONGODB_CONF = process.env.MONGODB_URI
}

module.exports = {
  MONGODB_CONF,
  PORT
}