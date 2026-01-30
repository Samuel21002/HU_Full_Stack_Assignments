const express = require('express')
const app = express()
const morgan = require('morgan')
const { Person } = require('../mongo')

const originalSend = app.response.send

//Middleware
app.use(express.static('dist'))
app.use(express.json())

app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body)
  this.__custombody__ = body
}

// Create two logging variables, loggingWithoutBody for GET methods and loggingWithBody for POST
morgan.token('response-body', (req, res) => {
  try {
    // Try to parse, but catch errors
    return JSON.stringify(JSON.parse(res.__custombody__))
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // If it fails, just return the body as-is or empty string
    return res.__custombody__ || ''
  }
})
const loggingWithoutBody = morgan('tiny')
const loggingWithBody = morgan(':method :url :status :res[content-length] - :response-time ms :response-body')

// ENDPOINTS
//GET ALL PEOPLE
app.get('/api/persons', loggingWithoutBody, (request, response, next) => {
  Person.find({}).then(persons => {
    if (!persons) {
      return response.status(500).json({
        error: 'Cannot get persons from server'
      })
    }
    response.json(persons)
  })
    .catch(error => next(error))
})

//CREATE NEW PERSON
app.post('/api/persons', loggingWithBody, (request, response, next) => {
  const payload = request.body

  const person = new Person({
    name: payload.name,
    number: payload.number,
  })

  person.save().then(savedObj => {
    response.json(savedObj)
  })
    .catch(error => next(error))
})

//GET PERSON
app.get('/api/persons/:id', loggingWithoutBody, (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: `Cannot find person with the ID: ${id}` })
      }
    })
    .catch(error => next(error))
})

//EDIT PERSON
app.put('/api/persons/:id', loggingWithBody, (request, response, next) => {
  const id = request.params.id
  const payload = request.body

  const updatedPerson = {
    name: payload.name,
    number: payload.number,
  }

  // Add options object with runValidators: true
  const options = {
    new: true,
    runValidators: true
  }

  Person.findByIdAndUpdate(id, updatedPerson, options)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: `Cannot find person with the ID: ${id}` })
      }
    })
    .catch(error => next(error))
})

//DELETE
app.delete('/api/persons/:id', loggingWithBody, (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (!result) {
        return response.status(404).send({ error: `Cannot find person with the ID: ${id}` })
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

//INFO
app.get('/api/info', loggingWithoutBody, (request, response, next) => {
  Person.find({}).then(persons => {
    if (!persons) {
      return response.status(500).json({
        error: 'Cannot get people from server'
      })
    }
    response.end(`Phonebook has info for ${persons.length} people\n${new Date(Date.now())}`)
  })
    .catch(error => next(error))
})


//////
// MIDDLEWARE
//////

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//////

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})