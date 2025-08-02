import { useQuery } from "@apollo/client";
import { ALL_BOOKS, GET_CURRENT_USER } from "../queries";

const Recommendation = (props) => {
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_CURRENT_USER);

  const favoriteGenre = userData?.me?.favoriteGenre;

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
  } = useQuery(ALL_BOOKS, {
    skip: !favoriteGenre,
    variables: { genre: favoriteGenre || "" },
  });

  // eslint-disable-next-line react/prop-types
  if (!props.show) return null;
  if (userLoading || recommendationsLoading) return <div>Loading...</div>;
  if (userError || recommendationsError)
    return (
      <div>Error: {userError?.message || recommendationsError?.message}</div>
    );

  // Handle case when userData.me is null (not logged in)
  if (!userData?.me) {
    return <div>Please log in to see recommendations.</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <strong>
        Books in your favorite genre: {favoriteGenre || "Not specified"}
      </strong>
      <br />
      <br />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendationsData.allBooks.map((a) => (
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

export default Recommendation;
