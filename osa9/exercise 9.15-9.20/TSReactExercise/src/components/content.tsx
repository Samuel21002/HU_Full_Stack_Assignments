const Content = (props : { parts: Array<{ name: string; exerciseCount: number }> }) => {
  return (
    <div>
      {props.parts.map(part => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
  );
};

export default Content;