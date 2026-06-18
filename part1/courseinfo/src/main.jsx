import React from 'react'
import { createRoot } from 'react-dom/client'

// Header component renders the course title
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

// Part component renders a single part's name and its exercise count
const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

// Content component renders three Part components, passing data to them
const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]} />
      <Part part={props.parts[2]} />
    </div>
  )
}

// Total component calculates and renders the sum of all exercises
const Total = (props) => {
  const sum = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises
  return (
    <p>Number of exercises {sum}</p>
  )
}

// App component holds the unified course data structure as a single object (Exercise 1.5)
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

// Render the application to the root container
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App