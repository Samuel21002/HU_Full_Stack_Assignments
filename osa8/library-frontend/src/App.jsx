import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import SetBirthyear from "./components/SetBirthyear";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("user-token") || null,
  );
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return !token ? (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("login")}>login</button>
      </div>
      <LoginForm show={page === "login"} setToken={setToken} />
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
    </div>
  ) : (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("edit")}>edit</button>
        <button onClick={() => setPage("recommend")}>recommend</button>
      </div>
      <button onClick={logout}>logout</button>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} setPage={setPage} />
      <SetBirthyear show={page === "edit"} />
      <Recommendation show={page === "recommend"} />
    </div>
  );
};

export default App;
