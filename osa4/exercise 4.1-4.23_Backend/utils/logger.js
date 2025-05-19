const morgan = require('morgan')

// Only use morgan in development mode
const routeLogger = process.env.NODE_ENV === 'dev'
  ? morgan('tiny')
  : (req, res, next) => next()

const info = (...params) => {
  if (process.env.NODE_ENV === 'dev') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV === 'dev') {
    console.error(...params)
  }
}

module.exports = { info, error, routeLogger }