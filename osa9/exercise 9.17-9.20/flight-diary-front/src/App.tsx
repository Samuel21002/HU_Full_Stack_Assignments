import { useState, useEffect } from "react";
import type { DiaryEntry } from "./types";
import { getAllDiaries, createDiary } from "./service";
import { Weather, Visibility } from "./types";

const App = () => {
  const [notes, setNotes] = useState<DiaryEntry[]>([]);
  const [comment, setComment] = useState("");
  const [visibility, setVisibility] = useState<Visibility | "">("");
  const [weather, setWeather] = useState<Weather | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [validation, setValidation] = useState<string>("");

  useEffect(() => {
    getAllDiaries().then((data) => {
      setNotes(data);
    });
  }, []);

  const diaryCreation = async(event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = {
        date: date,
        weather: weather,
        visibility: visibility,
        comment: comment,
      };
      const createdDiary = await createDiary(newEntry as DiaryEntry);
      setNotes(notes.concat(createdDiary));
      setComment("");
      setWeather("");
      setVisibility("");
      setValidation("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setValidation(error.message);
      } else {
        setValidation("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h1>Add entry</h1>
      <form onSubmit={diaryCreation}>
        Date:
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        /><br />
        Weather:
        {Object.values(Weather).map((w) => (
          <span key={w} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value={w}
              checked={weather === w}
              onChange={(event) => setWeather(event.target.value as Weather)}
            />
            {w}
          </span>
        ))}<br />
        Visibility:
        {Object.values(Visibility).map((v) => (
          <span key={v} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value={v}
              checked={visibility === v}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
            />
            {v}
          </span>
        ))}<br />
        Comment:
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        /><br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {validation && (
          <div style={{ color: "red" }}>
            {validation}
          </div>
        )}
      </div>
      <br />
      <table style={{ textAlign: "center" }}>
        <thead>
          <tr style={{ padding: "10px" }}>
            <th>Date</th>
            <th>Weather</th>
            <th>Visibility</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>
                <i>{note.date}</i>
              </td>
              <td>{note.weather}</td>
              <td>{note.visibility}</td>
              <td>{note.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
