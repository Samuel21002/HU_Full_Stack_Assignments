const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogsController')
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const testingRouter = require('./controllers/testController')
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')

const {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor } = require('./utils/middleware')

const app = express()

// Database
mongoose.connect(config.MONGODB_CONF)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// Requirements
app.use(express.static('dist'))
app.use(express.json())
app.use(tokenExtractor)
app.use(cors())

// Routes
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/health', async (req, res) => {
  // MongoDB connection health check
  if (mongoose.connection.readyState === 1) {
    // 1 = connected, try to ping the database
    try {
      await mongoose.connection.db.admin().ping()
      res.status(200).send('ok')
    } catch (error) {
      res.status(503).send('MongoDB ping failed')
    }
  } else {
    res.status(503).send('MongoDB not connected')
  }
})

// If tests are running, enable test controller
if (process.env.NODE_ENV === 'test') {
  app.use('/api/reset', testingRouter)
  console.log('Tests reseted from: api/reset')
}

// Middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
