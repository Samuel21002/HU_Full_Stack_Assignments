import { useState, useEffect } from 'react'
import Persons from './Components/persons.jsx'
import Filter from './Components/filter.jsx'
import Notification  from './Components/notifications.jsx'
import Form from './Components/forms.jsx'
import personService from './Services/personService.js'

const App = () => {
  const phoneRegex = "^[0-9]+(-[0-9]+)*$"
  useEffect(() => {
    personService.getPersons()
    .then(persons => {
      setPersons(persons)
    })
  }, [])

  // States for components
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNr, setNewPhoneNr] = useState('')
  const [filterQuery, changeFilter] = useState('')
  const [message, changeMessage] = useState({message:null, isError:false})

  const setMessage = (message, isError) => {
    changeMessage({message, isError})
    setTimeout(() => {
      changeMessage({message: null, isError: false})
    }, 3000)
  }

  const changeToNameField = (event) => {
    setNewName(event.target.value)
  }
  const changeToPhoneNrField = (event) => {
    setNewPhoneNr(event.target.value)
  }
  const filterPersons = filterQuery 
    ? [...persons.filter(x => x.name.toLowerCase().includes(filterQuery))]
    : persons

  const addOrUpdatePerson = () => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newPhoneNr
    }
    const personToUpdate = persons.find(n => n.name.toLowerCase() === newName.toLowerCase())
    if (personToUpdate) {
      // Asks whether old number will be replaced
      if (window.confirm(`${newName} is already added to phonebook. Do you want to replace the number?`)) {
        personService.updatePerson(personToUpdate.id, personObj)
        .then(res => {
          setPersons([...persons.map(person => person.id !== res.id ? person : res)])
          setMessage(`User ${personObj.name} number changed!`, false)
        }).catch(e => {
          if (e.response && e.response.status === 404) {
            setMessage(`User ${personObj.name} does not exist`, true);
          } else {  // For other errors
            setMessage(`Error updating user: ${e.message}`, true);
          }
        });
      } else {
        setMessage(`Create operation cancelled!`, true)
      }
    } else {
      personService.createPerson(personObj)
      .then(person => {
        setMessage(`User ${personObj.name} created!`, false)
        setPersons(persons.concat(person))
        changeFilter('');
      }).catch(e => {
        setMessage(`ERROR! : '${e}'`, true)
      });
    }
    setNewName(''); setNewPhoneNr('');
  }

  const removePerson = (event) => {
    const id = event.target.dataset.id
    if (window.confirm("Do you want to open in new tab?")) {
      personService.deletePerson(id)
      .then(res => {
        setPersons([...persons.filter(person => person.id !== res.id)])
        setMessage(`User deleted!`, false)
      }).catch(e => {
        if (e.response && e.response.status === 404) {
          setMessage(`User was already removed from server`, true);
        } else {
          setMessage(`Error updating user: ${error.message}`, true);
        }
      });
    } 
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationBody={message}/>
      Filter shown with:<Filter changeEvent={(event) => changeFilter(event.target.value)}/>
      <h2>Add a New Number</h2>
      <Form 
        newName={newName}
        newPhoneNr={newPhoneNr}
        onNameChange={changeToNameField}
        onPhoneChange={changeToPhoneNrField}
        onSubmit={addOrUpdatePerson}
        phoneRegex={phoneRegex}
      />
      <h2>Numbers</h2>
      <ul>
        {filterPersons.map((item, i) => <Persons key={i} contact={item} deleteButton={removePerson}/>)}
      </ul>
    </div>
  )

}



export default App