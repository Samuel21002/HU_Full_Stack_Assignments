import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"

const SetBirthyear = (props) => {

  const { data, loading } = useQuery(ALL_AUTHORS);
  const [selectedOption, setSelectedOption] = useState(null);
  const [birthYear, setBirthyear] = useState(""); // keep as string

  const options =
    data?.allAuthors.map((a) => ({
      value: a.name,
      label: a.name,
    })) || [];

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.error(
        "Mutation error:",
        error.graphQLErrors[0]?.message || error.message,
      );
    },
  });

  // eslint-disable-next-line react/prop-types
  if (!props.show || loading) return null;

  const submit = async (event) => {
    event.preventDefault();

    if (!selectedOption) {
      alert("Please select an author");
      return;
    }

    const authorName = selectedOption.value;
    const setBornTo = birthYear.trim() === "" ? null : parseInt(birthYear, 10);

    await editAuthor({ variables: { author: authorName, setBornTo } });

    setSelectedOption(null);
    setBirthyear("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          author
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born
          <input
            value={birthYear}
            type="number"
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">set birth year</button>
      </form>
    </div>
  );
};

export default SetBirthyear;
