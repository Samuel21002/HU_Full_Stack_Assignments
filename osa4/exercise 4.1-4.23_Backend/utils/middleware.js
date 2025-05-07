const { request } = require('../app')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = decodedToken.id
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Endpoint not found' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    console.log('Token extracted:', request.token)
  } else {
    console.log('No valid authorization header found')
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  switch (error.name) {
  case 'CastError':
    return response.status(400).send({ error: 'malformatted id' })
  case 'ValidationError':
    return response.status(400).json({ error: error.message })
  case 'MongoServerError':
    if (error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    break
  case 'JsonWebTokenError':
    return response.status(400).json({ error: 'token missing or invalid' })
  case 'TokenExpiredError':
    return response.status(401).json({
      error: 'token expired'
    })
  default:
    next(error)
  }
}


module.exports = {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
  userExtractor
}