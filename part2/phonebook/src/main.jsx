import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // Import axios to perform GET requests (Exercise 2.11)

// Filter component handles the search input
const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

// PersonForm component handles adding new contacts
const PersonForm = ({ onSubmit, nameValue, onNameChange, numberValue, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// Persons component lists out filtered contacts
const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <p key={person.id} style={{ margin: '5px 0' }}>
          {person.name} {person.number}
        </p>
      ))}
    </div>
  )
}

const App = () => {
  // Initialize with an empty array. Data will be populated from the server (Exercise 2.11)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  // Use the Effect hook to fetch data asynchronously on the initial render (Exercise 2.11)
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, []) // Empty dependency array ensures this effect runs only once

  // Sync state with name input changes
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Sync state with number input changes
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // Sync state with search input changes
  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value)
  }

  // Handle adding/submitting a new contact locally
  const addPerson = (event) => {
    event.preventDefault()

    // Check if the person is already registered
    const duplicateCheck = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (duplicateCheck) {
      setErrorMessage(`${newName} is already added to phonebook`)
      // Automatically dismiss custom warning banner after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: newName // Using the unique name as key identifier
    }

    setPersons(persons.concat(newPersonObject))
    setNewName('')
    setNewNumber('')
  }

  // Filter persons dynamically based on search terms
  const personsToShow = filterQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterQuery.toLowerCase())
      )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>Phonebook</h2>

      {/* Elegant Custom notification alert overlay instead of a standard breaking alert popup */}
      {errorMessage && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #f87171',
          color: '#991b1b',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage(null)} 
            style={{ 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            close
          </button>
        </div>
      )}

      <Filter value={filterQuery} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson} 
        nameValue={newName} 
        onNameChange={handleNameChange}
        numberValue={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

// Render the application directly to the root element
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App
