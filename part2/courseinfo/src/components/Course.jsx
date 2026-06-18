import React from 'react'

// Header component renders the individual course's name
const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}

// Part component renders a single part's name and its exercise count
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

// Content component maps over parts array and renders Part components
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

// Total component calculates the sum of all exercises using .reduce() (Exercises 2.2 and 2.3)
const Total = ({ parts }) => {
  const totalAmount = parts.reduce((sum, part) => {
    return sum + part.exercises
  }, 0)

  return (
    <strong>total of {totalAmount} exercises</strong>
  )
}

// Course component aggregates the Header, Content, and Total sub-components (Exercise 2.1)
const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
