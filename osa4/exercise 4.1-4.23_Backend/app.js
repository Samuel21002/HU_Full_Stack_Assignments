const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogsController')
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const config = require('./utils/config')
const logger = require('./utils/logger')
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

// Routes
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

// Middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app