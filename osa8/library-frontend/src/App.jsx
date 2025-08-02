import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notification from "./components/Notification.jsx";
import SetBirthyear from "./components/SetBirthyear";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED } from "./queries";
import {
  useNotificationDispatch,
  setNotification as setMessage,
} from "./context";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("user-token") || null,
  );
  const dispatch = useNotificationDispatch();
  const client = useApolloClient();
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      setMessage(dispatch, `Book "${data.data.bookAdded.title}" added`, 5);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return !token ? (
    <div>
      <Notification />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("login")}>login</button>
      </div>
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
    </div>
  ) : (
    <div>
      <Notification />
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
