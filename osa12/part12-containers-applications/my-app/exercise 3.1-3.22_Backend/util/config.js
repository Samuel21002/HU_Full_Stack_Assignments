require('dotenv').config()

const MONGO_URL = process.env.NODE_ENV === 'development'
  ? 'mongodb://root:password@mongo:27017/persons_db?authSource=admin'
  : process.env.MONGODB_URL

module.exports = {
  MONGO_URL
}
