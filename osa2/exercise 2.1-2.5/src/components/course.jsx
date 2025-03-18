/* Main course consisting of Header, Content (Child Parts) and Total number of parts */
const Course = ({course}) => {
  return (
    <div>
      <Header coursename={course.name}/>
      <Content courseContent={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = ({coursename}) => {
  return (
    <h2>{coursename}</h2>
  )
}

const Content = ({courseContent}) => {
  return (
    <>
      {courseContent.map((item) => (
        <Part key={item.id} part={item.name} exercises={item.exercises} />
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
    <p><b>Number of exercises {totalExercises}</b></p> 
  );
}

export default Course