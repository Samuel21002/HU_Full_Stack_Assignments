import { useState } from 'react'

const App = () => {
  // Anecdotes data
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // This is for creating the votes-object based on the initial amount of anecdotes in the list above (key = anecdote index, value = votes)
  const init_voteObj = anecdotes.reduce((obj, _, index) => {
  obj[index] = 0;
    return obj;
  }, {});

  // States & variables
  const [feedback, setFeedback] = useState({
    good:0,neutral:0,bad:0
  })  // For gathering anecdote feedback
  const [stats, setStats] = useState({
    average:0.0, positive:0.0, total:0
  })  // For rendering anecdote statistics
  const [selected, setSelected] = useState(0) // For selecting the index of the anecdote
  const [currentAnecdoteVotes, setVote] = useState(init_voteObj)  // For refreshing the full object of all anecdote votes
  const [anecdoteWithMostVotes, refreshAnecdoteWithMostVotes] = useState({})  // Returns the anecdote object with most votes

  // Event handlers
  const setGood = () => {
    const newFeedback = { ...feedback, good: feedback.good + 1 }
    setFeedback(newFeedback)
    setStats(calculateStats(newFeedback))
  }
  
  const setNeutral = () => {
    const newFeedback = { ...feedback, neutral: feedback.neutral + 1 }
    setFeedback(newFeedback)
    setStats(calculateStats(newFeedback))
  }
  
  const setBad = () => {
    const newFeedback = { ...feedback, bad: feedback.bad + 1 }
    setFeedback(newFeedback)
    setStats(calculateStats(newFeedback))
  }

  const calculateStats = (newFeedback) => {
    // Calculate Total
    const total = newFeedback.good + newFeedback.neutral + newFeedback.bad
    if (total !== 0) {
      // Calculate average feedback (Good = 1, Neutral = 0, Bad = -1)
      const average = (newFeedback.good - newFeedback.bad) / total
      // Calculate percentage of positive feedback
      const positive = (newFeedback.good / total) * 100
      return { average, positive, total }
    }
  }

  const nextAnecdote = () => {
    // Randomizes the index of the Anecdote array
    setSelected(() => {
      let rndIndex = Math.floor(Math.random() * anecdotes.length)
      return rndIndex
    })
  }

  const voteAnecdote = () => {
    setVote(prevVotes => {
      const newVoteObj = {...prevVotes}
      newVoteObj[selected] += 1
      refreshAnecdoteWithMostVotes(propWithMostVotes(newVoteObj)) // Renders the most popular anecdote
      return newVoteObj // Returns all votes
    })
  }
  const propWithMostVotes = object => {
    // In case of even amount of most votes, only the first entry of anecdotes with the most votes is returned
    if (anecdoteWithMostVotes) {
      return Object.keys(object).find(x => {
            return object[x] == Math.max.apply(null, 
            Object.values(object));
      });
    }
  };

  /*  Since the object key of the 'anecdoteWithMostVotes' is also the index of the anecdotes list, 
      it can be used to return the value in the component */
  return (
    <div>
      <h2><u>Give feedback:</u></h2>
      <Button value="Good" onClick={setGood}/>
      <Button value="Neutral" onClick={setNeutral}/>
      <Button value="Bad" onClick={setBad}/>
      <br/>
      <h2><u>Statistics</u></h2>
      <Statistics feedback={feedback} stats={stats}/>
      <br/>
      <h2><u>Anecdote of the day</u></h2>
      <Anecdote value={anecdotes[selected]} votes={currentAnecdoteVotes[selected]}/>
      <Button value="Vote" onClick={voteAnecdote}/>
      <Button value="Next Anecdote" onClick={nextAnecdote}/>
      <br/>
      <h2>Anecdote with most votes</h2>
      <Anecdote value={anecdotes[anecdoteWithMostVotes]} votes={currentAnecdoteVotes[anecdoteWithMostVotes]}/>
    </div>
  )
};


// ---------- //
// Components //
// ---------- //

const Button = ({onClick, value}) => {
  return(
    <button onClick={onClick}>{value}</button>
  )
};

const Statistics = ({feedback, stats}) => {
  if (stats.total !== 0) {
    return(
      <table>
        <tbody>
          <StatisticLine text="Good" value ={feedback.good} />
          <StatisticLine text="Neutral" value ={feedback.neutral} />
          <StatisticLine text="Bad" value ={feedback.bad} />
          <StatisticLine text="All" value ={stats.total} />
          <StatisticLine text="Average" value ={stats.average.toFixed(2)} />
          <StatisticLine text="Positive" value ={stats.positive.toFixed(2)} />
        </tbody>
      </table>
    )
  } else { 
    return (<p>No Feedback Given</p>)
  }
}

// Rendering each statistic as its own line component
const StatisticLine = (props) => <tr><td>{props.text}</td><td>{props. value}</td></tr>

const Anecdote = ({value, votes}) => {
  // Does not render the component if empty
  if(value) {
    return (
    <p>
      {value}<br/>
      has {votes} votes
    </p>
    )
  } else return <p>No votes have been casted yet.</p>
}

export default App