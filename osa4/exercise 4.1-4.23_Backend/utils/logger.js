const morgan = require('morgan')
const routeLogger = morgan('tiny')

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error, routeLogger }