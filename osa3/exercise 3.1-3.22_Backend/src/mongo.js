const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url = `mongodb+srv://zameezy:${password}@nodejsapp.39pcoyq.mongodb.net/?retryWrites=true&w=majority&appName=NodeJSApp`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

const note = new Person({
  name: personName,
  number: personNumber,
})

// Different cases depending on the amount of console arguments  
switch (true) {
    case (process.argv.length < 3):
        console.log('give password as argument')
        process.exit(1)
        break;
        
    case (process.argv.length === 3):
        Person.find({}).then(persons => {
            console.log("Phonebook:")
            persons.forEach(p => {
                console.log(p.name, p.number)
            })
            mongoose.connection.close()
            process.exit(1)
        })
        break;
        
    case (process.argv.length === 5):
        note.save().then(res => {
            console.log(`added ${personName} number ${personNumber} to phonebook`)
            mongoose.connection.close()
        })
        break;
        
    case (process.argv.length !== 5):
        console.log("Error, please provide a valid amount of arguments 'node mongo.js <password> <name> <number>")
        process.exit(1)
        break;
}