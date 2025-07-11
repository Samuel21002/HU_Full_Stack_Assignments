import axios from 'axios'
const baseUrl = '/anecdotes'

const getAllAnecdotes = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const getId = () => (100000 * Math.random()).toFixed(0)

const newAnecdote = async (content) => {
  const anecdoteObject = {
    content,
    id: getId(),
    votes: 0
  }
  const res = await axios.post(baseUrl, anecdoteObject)
  return res.data
}

const voteAnecdote = async (updatedAnecdote) => {
  const res = await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
  return res.data
}

export default { getAllAnecdotes, newAnecdote, voteAnecdote }