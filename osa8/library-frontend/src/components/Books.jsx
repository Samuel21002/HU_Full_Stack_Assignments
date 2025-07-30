import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import _ from "lodash";

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const [uniqueGenres, setAllGenres] = useState([]);

  const { data: allData, loading: allLoading, error: allError } = useQuery(ALL_BOOKS, { pollInterval: 5000 });
  const { data: filteredData, loading: filteredLoading, error: filteredError } = useQuery(ALL_BOOKS, {
    variables: genre ? { genre } : {},
  });

  useEffect(() => {
    if (allData && allData.allBooks) {
      const genres = _.uniq(_.flatMap(allData.allBooks, "genres")).filter(x => x !== '');
      setAllGenres(genres);
    }
  }, [allData]);

  // eslint-disable-next-line react/prop-types
  if (!props.show) return null;
  if (allLoading || filteredLoading) return <div>Loading...</div>;
  if (allError) return <div>Error (genres): {allError.message}</div>;
  if (filteredError) return <div>Error (books): {filteredError.message}</div>;
  
  return (
    <div>
      <h2>books</h2>
      <div>
        <strong>Genres:</strong>{" "}
        {uniqueGenres.map((g) => (
          <button key={g} onClick={() => setGenre(g)} style={{ marginRight: "5px" }}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)} style={{ marginRight: "5px" }}>
          All Genres
        </button>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredData.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
