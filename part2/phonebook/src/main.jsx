import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

// --- BACKEND SERVICE MODULE ---
const personService = {
  getAll: () => axios.get(baseUrl).then(response => response.data),
  create: (newObject) => axios.post(baseUrl, newObject).then(response => response.data),
  update: (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data),
  remove: (id) => axios.delete(`${baseUrl}/${id}`).then(response => response.data)
}

// --- NOTIFICATION COMPONENT ---
const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const { message, type } = notification

  const notificationStyle = {
    color: type === 'error' ? '#991b1b' : '#065f46',
    background: type === 'error' ? '#fee2e2' : '#ecfdf5',
    fontSize: '16px',
    border: `2px solid ${type === 'error' ? '#f87171' : '#34d399'}`,
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '20px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

// --- SUB-COMPONENTS ---
const Filter = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      filter shown with <input value={value} onChange={onChange} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
    </div>
  )
}

const PersonForm = ({ onSubmit, nameValue, onNameChange, numberValue, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <div>
        name: <input value={nameValue} onChange={onNameChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>
      <div>
        <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, onDelete }) => {
  return (
    <div>
      {personsToShow.map(person => (
        <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
          <span>{person.name} {person.number}</span>
          <button 
            onClick={() => onDelete(person.id, person.name)}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

// --- MAIN COMPONENT ---
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(() => {
        showNotification('Failed to fetch initial contacts from database', 'error')
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterQuery(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
            showNotification(`Updated number for ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showNotification(
              `Information of '${existingPerson.name}' has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const newPersonObject = { name: newName, number: newNumber }

    personService
      .create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        showNotification('Failed to save the new contact on server', 'error')
      })
  }

  const deletePersonOf = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)
    
    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Removed ${name} successfully`)
        })
        .catch(() => {
          showNotification(`The contact '${name}' was already deleted from server`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = filterQuery === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterQuery.toLowerCase())
      )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '25px', maxWidth: '500px', margin: '20px auto', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
