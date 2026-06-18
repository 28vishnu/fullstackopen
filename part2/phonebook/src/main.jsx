import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

// --- BACKEND SERVICE MODULE (Exercise 2.13) ---
// We extract our API communications into a distinct, clean service layer.
// This fulfills the "Single Responsibility Principle" in a single-file environment.
const personService = {
  getAll: () => {
    return axios.get(baseUrl).then(response => response.data)
  },
  create: (newObject) => {
    return axios.post(baseUrl, newObject).then(response => response.data)
  },
  update: (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
  },
  remove: (id) => {
    return axios.delete(`${baseUrl}/${id}`).then(response => response.data)
  }
}

// --- SUB-COMPONENTS (Exercise 2.10 Refactoring) ---
const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

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

const Persons = ({ personsToShow, onDelete }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <p key={person.id} style={{ margin: '8px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>{person.name} {person.number}</span>
          <button 
            onClick={() => onDelete(person.id, person.name)}
            style={{
              padding: '2px 8px',
              cursor: 'pointer',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

// --- MAIN APPLICATION COMPONENT ---
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [notification, setNotification] = useState(null)

  // Load the initial contact database on page mount (Exercise 2.11)
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showNotification('Failed to fetch data from server', 'error')
      })
  }, [])

  // Helper to show modern status/alert notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterQuery(event.target.value)

  // Handle Form Submission: Create or Update (Exercises 2.12 & 2.15)
  const addPerson = (event) => {
    event.preventDefault()

    // Search for existing entries matching the input name (case-insensitive)
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      // Exercise 2.15*: If the user already exists, offer to update the phone number
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPersonObject = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPersonObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
            showNotification(`Updated ${returnedPerson.name}'s phone number`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            // Handle error cases like if another user deleted the contact first
            showNotification(
              `Information of '${existingPerson.name}' has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    // Exercise 2.12: If it's a new name, perform an HTTP POST request
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        showNotification('Failed to add new contact', 'error')
      })
  }

  // Handle Deletion (Exercise 2.14)
  const deletePersonOf = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)
    
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(error => {
          showNotification(`The contact '${name}' was already deleted from server`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  // Filter contacts dynamically based on user input
  const personsToShow = filterQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterQuery.toLowerCase())
      )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Phonebook</h2>

      {/* Elegant Custom Status Notification Overlay */}
      {notification && (
        <div style={{
          background: notification.type === 'error' ? '#fee2e2' : '#ecfdf5',
          border: `1px solid ${notification.type === 'error' ? '#f87171' : '#34d399'}`,
          color: notification.type === 'error' ? '#991b1b' : '#065f46',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          {notification.message}
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
      <Persons personsToShow={personsToShow} onDelete={deletePersonOf} />
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App
