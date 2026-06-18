import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'

// Define the API key safely from Vite's environmental variables (Exercise 2.20)
const api_key = import.meta.env.VITE_SOME_KEY || ''

// --- COUNTRY DETAIL VIEW ---
const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const capital = country.capital ? country.capital[0] : ''

  // Fetches current weather for the capital if OpenWeatherMap API key is configured (Exercise 2.20)
  useEffect(() => {
    if (capital && api_key) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.error('Weather data fetch failed:', error)
        })
    }
  }, [capital])

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>{country.name.common}</h2>
      <p style={{ margin: '5px 0' }}>capital {capital}</p>
      <p style={{ margin: '5px 0' }}>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      
      <div style={{ fontSize: '100px', margin: '20px 0' }}>
        {country.flag}
      </div>

      {api_key ? (
        weather ? (
          <div>
            <h3>Weather in {capital}</h3>
            <p>temperature {weather.main.temp} Celsius</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
              style={{ background: '#f3f4f6', borderRadius: '50%' }}
            />
            <p>wind {weather.wind.speed} m/s</p>
          </div>
        ) : (
          <p>Loading weather reports...</p>
        )
      ) : (
        <p style={{ color: '#d97706', fontSize: '14px', background: '#fef3c7', padding: '10px', borderRadius: '4px' }}>
          ⚠️ Weather data is hidden. Please start Vite with the OpenWeather API key environment variable: VITE_SOME_KEY.
        </p>
      )}
    </div>
  )
}

// --- MAIN COUNTRIES COMPONENT ---
const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Fetch complete dataset on startup (Exercise 2.18)
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Failed to load restcountries data dataset:', error)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setSelectedCountry(null) // Reset selection when user types a new search query
  }

  // Filter list matching search parameter case-insensitively
  const matchedCountries = searchQuery === ''
    ? []
    : countries.filter(c => 
        c.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '25px', maxWidth: '600px', margin: '20px auto' }}>
      <div>
        find countries <input value={searchQuery} onChange={handleSearchChange} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
      </div>

      {/* Conditional list views based on count rules (Exercise 2.18 & 2.19) */}
      <div style={{ marginTop: '20px' }}>
        {selectedCountry ? (
          <CountryDetail country={selectedCountry} />
        ) : matchedCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : matchedCountries.length > 1 ? (
          <div>
            {matchedCountries.map(country => (
              <div key={country.cca3} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span>{country.name.common}</span>
                <button 
                  onClick={() => setSelectedCountry(country)}
                  style={{
                    padding: '4px 8px',
                    cursor: 'pointer',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                >
                  show
                </button>
              </div>
            ))}
          </div>
        ) : matchedCountries.length === 1 ? (
          <CountryDetail country={matchedCountries[0]} />
        ) : searchQuery !== '' ? (
          <p>No matches found</p>
        ) : null}
      </div>
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)

export default App
