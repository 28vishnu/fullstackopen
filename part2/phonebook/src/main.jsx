import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

// Filter component handles the search input (Exercise 2.10)
const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

// PersonForm component handles adding new contacts (Exercise 2.10)
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

// Persons component lists out filtered contacts (Exercise 2.10)
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
  // Hardcoded dummy data for testing filtering out-of-the-box (Exercise 2.9)
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 'Arto Hellas' },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 'Ada Lovelace' },
    { name: 'Dan Abramov', number: '12-43-234345', id: 'Dan Abramov' },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 'Mary Poppendieck' }
  ])

  // Controlled component states
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  // Sync state with name input changes
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Sync state with number input changes (Exercise 2.8)
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  // Sync state with search input changes (Exercise 2.9)
  const handleFilterChange = (event) => {
    setFilterQuery(event.target.value)
  }

  // Handle adding/submitting a new contact
  const addPerson = (event) => {
    event.preventDefault()

    // Check if the person is already registered (Exercise 2.7)
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

  // Filter persons dynamically based on search terms (Exercise 2.9)
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
