import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'
import { messageChange } from '../reducers/notificationReducer'

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

  const anecdotes = useSelector(state => {
    const filtered = state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(a =>
          a.content.toLowerCase().includes(state.filter.toLowerCase())
      );
    return [...filtered].sort((a, b) => b.votes - a.votes);
  });

  return (
    <>
      {anecdotes.map(anecdote =>
      <Anecdote 
        key={anecdote.id}
        anecdote={anecdote}
        handleClick={() => {
          dispatch(voteAnecdote(anecdote.id))
          dispatch(messageChange(`Vote added for ${anecdote.content.slice(0, 30) + "..."}!`, 3))
        }}/>
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