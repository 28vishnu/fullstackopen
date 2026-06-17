import React from 'react'
import { createRoot } from 'react-dom/client'

// Header-komponentti huolehtii kurssin nimen esittämisestä
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

// Part-komponentti esittää yksittäisen osan nimen ja tehtävien määrän
const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
}

// Content-komponentti esittää kurssin eri osat hyödyntäen Part-komponenttia
const Content = (props) => {
  return (
    <div>
      <Part name={props.part1} exercises={props.exercises1} />
      <Part name={props.part2} exercises={props.exercises2} />
      <Part name={props.part3} exercises={props.exercises3} />
    </div>
  )
}

// Total-komponentti näyttää tehtävien yhteismäärän
const Total = (props) => {
  return (
    <p>Tehtäviä yhteensä {props.sum}</p>
  )
}

// App-komponentti sisältää sovelluksen datan ja toimii juurena
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content 
        part1={part1} exercises1={exercises1}
        part2={part2} exercises2={exercises2}
        part3={part3} exercises3={exercises3}
      />
      <Total sum={exercises1 + exercises2 + exercises3} />
    </div>
  )
}

// Renderöidään sovellus DOM-puuhun 'root'-elementin sisälle käyttäen suoraan tuotua createRoot-funktiota
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App
