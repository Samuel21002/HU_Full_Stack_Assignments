import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import _ from "lodash";
import {
  useNotificationDispatch,
  setNotification as setMessage,
} from "../context";

const Books = (props) => {
  const dispatch = useNotificationDispatch();
  const [genre, setGenre] = useState(null);
  const [uniqueGenres, setAllGenres] = useState([]);

  const {
    data: allData,
    loading: allLoading,
    error: allError,
  } = useQuery(ALL_BOOKS, { pollInterval: 5000 });
  const {
    data: filteredData,
    loading: filteredLoading,
    error: filteredError,
  } = useQuery(ALL_BOOKS, {
    variables: genre ? { genre } : {},
  });

  useEffect(() => {
    if (allData && allData.allBooks) {
      const genres = _.uniq(_.flatMap(allData.allBooks, "genres")).filter(
        (x) => x !== "",
      );
      setAllGenres(genres);
    }
  }, [allData]);

  useEffect(() => {
    if (allLoading || filteredLoading) {
      setMessage(dispatch, "Loading app");
    } else {
      dispatch({ type: "Clear" });
    }
  }, [allLoading, filteredLoading, dispatch]);

  // eslint-disable-next-line react/prop-types
  if (allLoading || filteredLoading) return <div>Loading...</div>;
  if (allError)
    return setMessage(dispatch, `Error (genres): ${allError.message}`, 5, true);
  if (filteredError)
    return setMessage(
      dispatch,
      `Error (books): ${filteredError.message}`,
      5,
      true,
    );
  // eslint-disable-next-line react/prop-types
  if (!props.show) return null;

  return (
    <div>
      <h2>books</h2>
      <div>
        <strong>Genres:</strong>{" "}
        {uniqueGenres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{ marginRight: "5px" }}
          >
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
              <td>{a.author?.name || "-"}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
