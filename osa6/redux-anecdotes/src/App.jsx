import Anecdotes from "./components/AnecdoteList"
import Filter from "./components/AnecdoteFilter"
import NewAnecdote from "./components/AnecdoteForm"
import Notification from "./components/Notification"

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initialize } from "./reducers/anecdoteReducer"

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(initialize()) 
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification/>
      <Filter/>
      <Anecdotes/>
      <NewAnecdote/>
    </div>
  )
}

export default App

