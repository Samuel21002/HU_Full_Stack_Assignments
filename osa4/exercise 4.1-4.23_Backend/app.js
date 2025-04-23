const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogsController')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')

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

// Routes
app.use('/api/blogs', blogsRouter)

// Middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app