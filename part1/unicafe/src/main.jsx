import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'

// Button component handles each feedback button interaction
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

// StatisticLine component renders a single statistic row inside an HTML table
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

// Statistics component handles calculating averages and rendering the tabular statistics
const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  // Conditional Rendering: Show instructions if no feedback is provided yet (Exercise 1.9)
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / total
  const positivePercentage = (good / total) * 100

  // Renders the statistics inside a clean HTML table (Exercise 1.11)
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average.toFixed(1)} />
        <StatisticLine text="positive" value={positivePercentage.toFixed(1) + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  // Individual state management variables (Exercise 1.6)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

// Render the application directly to the root element
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App