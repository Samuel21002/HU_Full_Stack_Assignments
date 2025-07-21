import axios from 'axios'

const getCountry = async (query) => {
  try {
    const res = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${query}`)
    return {
      name: res.data.name.common,
      capital: res.data.capital,
      population: res.data.population,
      flag: res.data.flags.png,
      found: true
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { found: false }
    } else {
      throw error
    }
  }
}

export default { getCountry }
