const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

// Enable CORS middleware so our local React development server can access this API (Exercise 3.9)
app.use(cors())

// Instruct Express to check and serve any static files from the compiled 'dist' folder first (Exercise 3.11)
app.use(express.static('dist'))

// Body parser middleware to handle incoming raw JSON request payloads
app.use(express.json())

// --- CUSTOM MORGAN LOG CONFIGURATION (Exercises 3.7 & 3.8*) ---
// Define a custom token that captures the body payload only during HTTP POST requests
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use the tiny logging format with our custom body output appended at the end
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Initial in-memory database representation (Exercise 3.1)
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// --- ENDPOINTS & ROUTING ---

// GET: Fetch the entire list of contacts
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// GET: Display application metadata and system time (Exercise 3.2)
app.get('/info', (request, response) => {
  const entryCount = persons.length
  const currentDate = new Date()
  
  const infoTemplate = `
    <p>Phonebook has info for ${entryCount} people</p>
    <p>${currentDate}</p>
  `
  response.send(infoTemplate)
})

// GET: Fetch a single contact entry matching the specified ID parameters (Exercise 3.3)
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person entry not found' })
  }
})

// DELETE: Remove an entry matching the specified ID from local memory (Exercise 3.4)
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  
  response.status(204).end()
})

// POST: Add a new entry after enforcing validation logic (Exercises 3.5 & 3.6)
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validation: Ensure both name and number are present
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // Validation: Enforce strict name uniqueness constraints
  const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  // Generate a high-range random numerical string for the identifier (Exercise 3.5)
  const generatedId = String(Math.floor(Math.random() * 1000000))

  const newPerson = {
    id: generatedId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Catch-all route handler middleware for any unknown queries
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Dynamically bind to the platform's environmental PORT, fallback to 3001 locally (Exercise 3.10)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})