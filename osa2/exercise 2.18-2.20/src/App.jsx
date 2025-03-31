import { useState, useEffect } from 'react'
import APIService from './Services/APIService.js'
import Country from './Components/CountryElement.jsx'
import Message from './Components/Message.jsx'
import Searchform from './Components/Search.jsx'
import Weather from './Components/WeatherWidget.jsx'
import CountryDetails from './Components/CountryDetails.jsx'

function App() {
  const [allCountryNames, assignCountryNameList] = useState([])
  const [message, changeMessageState] = useState({message:null, isError:false})
  const [selectedCountry, setSelectedCountry] = useState({})
  const [weather, setWeather] = useState([])
  const [filteredCountryList, setFilteredCountryList] = useState([])

  // Also checks the length of the filtered list and returns values if 
  const changeSearchParameter = (searchValue) => {
    setSelectedCountry('')

    const newFilteredList = allCountryNames.filter(
      name => name.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    switch(true) {
      case newFilteredList.length > 10:
        setMessage(`Too many results. Specify another filter`, false)
        setFilteredCountryList([]) // empty the list
        break;
      case (newFilteredList.length > 0 && newFilteredList.length <= 10):
        setFilteredCountryList(newFilteredList)
        setMessage(null, false)
        break;
      default:
        setFilteredCountryList([])
        setMessage('No results', false)
    }
  }

  // Keeps error messages constantly visible, otherwise message will display for 3 secs
  const setMessage = (message, isError) => {
    changeMessageState({message, isError})
    !isError ? setTimeout(() => {
      changeMessageState({message: null, isError: false})
    }, 3000) : null;
  }
  
  // Shows details about the selected country
  const showDetailsEvent = (event) => {
    const id = event.target.dataset.country
    setMessage(null, false)
    APIService.getCountry(id)
    .then(x => {
      setSelectedCountry(x)
      if (x.coordinates) {
        getWeather(x.coordinates)
      }
    })
    .catch(e => setMessage(`Error : ${e.message}`, true))
    return id
  }

  // Gets the local weather of the capital city coordinates gathered from the API in 'showDetailsEvent'
  const getWeather = (coordinates) => {
    APIService.getWeather(coordinates)
    .then(x => {
      setWeather({temp:x.main.temp, wind: x.wind.speed, weatherIcon:x.weather[0].icon})
    })
    .catch(e => setMessage(`Error getting weather:\n${e}`, true));
  }
    
  // Gets the list of countries into the 'allCountryNames' array on start
  useEffect(() => {
    APIService.getAllCountrynames()
    .then(x => assignCountryNameList(x))
    .catch(e => setMessage(`Error getting countries list!\n${e}`, true));
    }, []
  )

  /*  - Search filter input
      - Error and information message component
      - List of countries found in search results
      - Country details component
      - Local weather in the capital city
  */
  return (
    <>
      <Searchform value={(event) => changeSearchParameter(event.target.value)}/>
      <Message messageBody={message}/>
      {filteredCountryList.map((x, i) => <Country key={i} country={x} showDetails={showDetailsEvent}/> )} 
      <CountryDetails info={selectedCountry}/>
      <Weather location={selectedCountry} weather={weather}/>
    </>
  )
}

export default App
