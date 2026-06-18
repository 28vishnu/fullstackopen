import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // selected state tracks the index of the currently displayed anecdote
  const [selected, setSelected] = useState(0)
  
  // votes state tracks the vote count of each anecdote using an array
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  // Selects a random index from the anecdotes array
  const handleRandomClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  // Updates the vote count of the currently displayed anecdote immutably
  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  // Determines the highest number of votes and find its index
  const maxVotes = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(maxVotes)

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVoteClick}>vote</button>
      <button onClick={handleRandomClick}>next anecdote</button>

      <h2>Anecdote with most votes</h2>
      {maxVotes > 0 ? (
        <div>
          <p>{anecdotes[mostVotedIndex]}</p>
          <p>has {maxVotes} votes</p>
        </div>
      ) : (
        <p>No votes cast yet</p>
      )}
    </div>
  )
}

// Render the application directly to the root element
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App