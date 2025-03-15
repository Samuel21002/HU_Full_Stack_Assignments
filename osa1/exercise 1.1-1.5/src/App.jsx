const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content courseContent={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = (coursename) => {
  return (
    <h1>{coursename.course.name}</h1>
  )
}

const Content = ({courseContent}) => {
  return (
    <>
      {courseContent.map((item, i) => (
        <Part key={i} part={item.name} exercises={item.exercises} />
      ))}
    </>
  )
}

// Just for rendering one course element at a time
const Part = (course) => {
  return (
    <p>
      {course.part} {course.exercises}
    </p>
  )
}

// For displaying total amount of exercises
const Total = (total) => {
  const totalExercises = total.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p>Number of exercises {totalExercises}</p> 
  );
}

export default App

