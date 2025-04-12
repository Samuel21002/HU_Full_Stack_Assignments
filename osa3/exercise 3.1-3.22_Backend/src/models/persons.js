const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [30, 'Contact name cannot be longer than 30'],
    required: [true, 'Please fill in a name for the contact']
  },
  number: {
    type: String,
    minlength: [8, 'Minimum length for the number is 8'],
    required: [true, 'Phone number missing'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{3,9}$/.test(v)
      },
      message: props => `${props.value} is not in the right format!
        Make sure the number is 8-12 digits long, separated with - with a two or three digit prefix`
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
