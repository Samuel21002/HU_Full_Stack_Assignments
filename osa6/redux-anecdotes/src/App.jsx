import Notes from "./components/AnecdoteList"
import NewNote from "./components/AnecdoteForm"

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Notes/>
      <NewNote/>
    </div>
  )
}

export default App