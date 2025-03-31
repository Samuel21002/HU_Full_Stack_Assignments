import axios from 'axios';

// Returns a list of all countries to the front-end
const getAllCountrynames = () => {
    return axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(
        res => {
            return res.data.map(country => country.name.common )
        }
    )
}

// Gets the local weather in the defined coordinates. Currently API-key has to be stored in an env variable (define your own before usage)
const getWeather = (coordinates) => {
    const APIkey = import.meta.env.VITE_SOME_KEY
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${APIkey}&units=metric`)
    .then(
        res => res.data
    )

}

// Returns the country information
const getCountry = (query) => {
    return axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${query}`).then(
        res => {
            return {
                name:res.data.name.common,
                capital:res.data.capital,
                area:res.data.area,
                languages:res.data.languages,
                flag:res.data.flags.png,
                coordinates:res.data.capitalInfo.latlng
            }
        }
    )
}


export default { getAllCountrynames, getCountry, getWeather }