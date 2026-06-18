const express = require('express')
const morgan = require('morgan')
const app = express()

// Activate json-parser middleware to parse inbound JSON body strings into JS objects
app.use(express.json())

// --- MORGAN LOGGING CONFIGURATION (Exercises 3.7 & 3.8*) ---
// Define a custom token that extracts and stringifies the request body payload during POST operations
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

// Use morgan middleware configured with the 'tiny' parameters combined with our custom token tracking payload
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Hardcoded initial phonebook entries dataset (Exercise 3.1)
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// --- ENDPOINTS & ROUTING RULES ---

// GET: Fetch entire collection of persons (Exercise 3.1)
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// GET: Metadata summary route displaying count and current time parameters (Exercise 3.2)
app.get('/info', (request, response) => {
  const entryCount = persons.length
  const currentDate = new Date()
  
  const infoTemplate = `
    <p>Phonebook has info for ${entryCount} people</p>
    <p>${currentDate}</p>
  `
  response.send(infoTemplate)
})

// GET: Fetch a singular person resource matching ID properties (Exercise 3.3)
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person entry not found' })
  }
})

// DELETE: Remove an identified person resource cleanly from state (Exercise 3.4)
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  
  response.status(204).end()
})

// POST: Validate and register new entries into collection states (Exercises 3.5 & 3.6)
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Validation Check 1: Ensure name and number parameters exist
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  // Validation Check 2: Ensure name uniqueness constraints are sustained
  const nameExists = persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  // Generate large random id value to mitigate collisions (Exercise 3.5)
  const generatedId = String(Math.floor(Math.random() * 1000000))

  const newPerson = {
    id: generatedId,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.json(newPerson)
})

// Catch-all middleware handler for routing queries mapping to undefined endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Start Express runtime listener
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})