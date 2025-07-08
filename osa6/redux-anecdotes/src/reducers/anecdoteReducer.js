import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  },
})

export const initialize = () => {
  return async dispatch => {
    const anecdote = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdote))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.postAnecdote(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const voteAnecdote = id => {
  return async (dispatch, getState) => {
    const anecdoteToChange = getState().anecdotes.find(a => a.id === id)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    const updatedAnecdote = await anecdoteService.voteAnecdote(changedAnecdote)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}
export const { setAnecdote, appendAnecdote, updateAnecdote } = anecdoteSlice.actions
export { asObject } 
export default anecdoteSlice.reducer