import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS, CREATE_BOOK } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(0);
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.error("Mutation error:", error);
      if (error.graphQLErrors?.length) {
        error.graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
        });
      }
      if (error.networkError) {
        console.error(`[Network error]: ${error.networkError}`);
      }
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });
    },
  });

  // eslint-disable-next-line react/prop-types
  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    console.log(title, author, published, genres);
    console.log("add book...");
    createBook({ variables: { title, author, published, genres } });
    // eslint-disable-next-line react/prop-types
    props.setPage("books");

    setTitle("");
    setPublished(0);
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
