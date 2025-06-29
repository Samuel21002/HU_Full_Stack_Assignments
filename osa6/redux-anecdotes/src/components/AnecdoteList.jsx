import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, handleClick }) => {
  return(
      <div>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={handleClick}>vote</button>
        </div>
      </div>
  )
}

const Anecdotes = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state).sort((a, b) => b.votes - a.votes);

  return (
      <>
          {anecdotes.map(anecdote =>
          <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => dispatch(voteAnecdote(anecdote.id))}/>
          )}
      </>
  )
}

export default Anecdotes

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired
}

Anecdote.displayName = 'Anecdote'