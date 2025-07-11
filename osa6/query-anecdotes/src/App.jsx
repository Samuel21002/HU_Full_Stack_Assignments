import AnecdoteForm from "./components/AnecdoteForm";
import anecdoteService from "./service";
import Notification from "./components/Notification";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch, setNotification } from "./context/notificationContext";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const updateNoteMutation = useMutation({
    mutationFn: anecdoteService.voteAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      setNotification(dispatch, "Vote added", 2);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) =>
          a.id !== updatedAnecdote.id ? a : updatedAnecdote
        )
      );
    },
  });

  const handleVote = (anecdote) => {
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };
    updateNoteMutation.mutate(changedAnecdote);
  };

  const anecdotes = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAllAnecdotes,
    retry: 3,
  });

  useEffect(() => {
    anecdotes.isLoading
      ? setNotification(dispatch, "Loading app")
      : dispatch({ type: "Clear" });

    anecdotes.isError && setNotification(dispatch, "Server error");
  }, [anecdotes.isLoading, anecdotes.isError, dispatch]);

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />

      {!anecdotes.isLoading && !anecdotes.isError && (
        <>
          <AnecdoteForm />
          {anecdotes.data
            .sort((a, b) => b.votes - a.votes)
            .map((anecdote) => (
              <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => handleVote(anecdote)}>vote</button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default App;
