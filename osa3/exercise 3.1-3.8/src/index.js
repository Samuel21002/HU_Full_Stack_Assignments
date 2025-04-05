const express = require('express')
const app = express()
const morgan = require('morgan')

const originalSend = app.response.send

//Middleware
app.use(express.json())
app.use(express.static('dist'))

app.response.send = function sendOverWrite(body) {
    originalSend.call(this, body)
    this.__custombody__ = body
}

// Create two logging variables, loggingWithoutBody for GET methods and loggingWithBody for POST
morgan.token('response-body', (req, res) => {
    try {
        // Try to parse, but catch errors
        return JSON.stringify(JSON.parse(res.__custombody__));
    } catch (e) {
        // If it fails, just return the body as-is or empty string
        return res.__custombody__ || '';
    }
});
const loggingWithoutBody = morgan('tiny')
const loggingWithBody = morgan(':method :url :status :res[content-length] - :response-time ms :response-body')

let contacts = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: "2",
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: "3",
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: "4",
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
  ]

// ENDPOINTS
//GET ALL PERSONS
app.get('/api/persons', loggingWithoutBody, (request, response) => {
  response.json(contacts)
})

function validateContact(contact) {
    return Object.hasOwn(contact, 'name') && Object.hasOwn(contact, 'number') &&
    contact.name !== '' && contact.number !== '';
}

//CREATE NEW PERSON
app.post('/api/persons', loggingWithBody, (request, response) => {
    const payload = request.body
  if (!validateContact(payload)) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (contacts.some(x => x.name === payload.name)) {
    return response.status(400).json({ 
        error: 'contact already exists' 
    })
  }

  const randId = Math.floor(Math.random() * Math.pow(10,9));
  payload.id = String(randId)
  contacts = contacts.concat(payload)
  response.json(payload)
})

//GET PERSON
app.get('/api/persons/:id', loggingWithoutBody, (request, response) => {
    const id = request.params.id
    const note = contacts.find(n => n.id === id)
    return note ? response.json(note) : response.status(404).end()
})

//DELETE
app.delete('/api/persons/:id', loggingWithBody, (request, response) => {
    const id = request.params.id
    const contactToDelete = contacts.find(n => n.id === id)
    
    if (!contactToDelete) {
        return response.status(404).json({ error: 'contact not found' })
    }
    
    contacts = contacts.filter(n => n.id !== id)
    return response.status(204).json(contactToDelete)
})

//INFO
app.get('/api/info', loggingWithoutBody, (request, response) => {
  response.end(`Phonebook has info for ${contacts.length} people\n${new Date(Date.now())}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})