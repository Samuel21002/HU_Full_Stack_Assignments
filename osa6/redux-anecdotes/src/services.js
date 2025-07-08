import axios from 'axios'
import { asObject } from './reducers/anecdoteReducer'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const postAnecdote = async (content) => {
  const object = asObject(content)
  const response = await axios.post(baseUrl, object)
  return response.data
}

const voteAnecdote = async (newObject) => {
  return axios.put(`${baseUrl}/${newObject.id}`, newObject).then(response => response.data)
}


export default { getAll, postAnecdote, voteAnecdote }