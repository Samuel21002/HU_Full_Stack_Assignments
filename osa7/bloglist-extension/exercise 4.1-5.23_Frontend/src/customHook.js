import { useState } from "react";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const resetfield = () => setValue("");

  return {
    attributes: {
      type,
      value,
      onChange,
    },
    resetfield,
  };
};

export default useField;
