import { useState, useEffect } from 'react'
import axios from 'axios'

// Filter component
const Filter = ({ searchTerm, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input 
        value={searchTerm}
        onChange={handleSearchChange} 
      />
    </div>
  )
}

// Form component
const PersonForm = ({ 
  newName,
  newNumber, 
  handleNameChange,
  handleNumberChange, 
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input 
          value={newName} 
          onChange={handleNameChange} />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// Single person component
const Person = ({ person }) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  )
}

//filtered persons component
const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map(person => 
        <Person key={person.name} person={person} />
      )}
    </ul>
  )
} 

// Main App component
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('') // for search 

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault() //  Prevent page reload
    console.log('button clicked', event.target)

    // Check if the name is already in the list
    const nameAlreadyExists = (persons.some(person => 
      person.name === newName)) 

      if (nameAlreadyExists) {
      // Alert the user if the name already exists
      alert(`${newName} is already added to phonebook`)
      return
    }

    // create the new person object
    const personObject = { 
      name: newName, 
      number: newNumber, }

      axios.post('http://localhost:3001/persons', 
        personObject)
      .then(response => {
        setPersons(persons.concat(personObject))
          setNewName('')
          setNewNumber('')
        })
  }

  const handleNameChange = (e) => {setNewName(e.target.value)}
  const handleNumberChange = (e) => {setNewNumber(e.target.value)}
  const handleSearchChange = (e) => {setSearchTerm(e.target.value)} 

  // filter logic for search
  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  
    return (
      <div>
        <h2>Phonebook</h2>

        <Filter 
          searchTerm={searchTerm} 
          handleSearchChange={handleSearchChange} 
        />
        
        <h3>Add a new</h3>

        <PersonForm 
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={addPerson}
        />

        <h3>Numbers</h3>

        <Persons personsToShow={personsToShow} />
      </div>
    )
}

  export default App