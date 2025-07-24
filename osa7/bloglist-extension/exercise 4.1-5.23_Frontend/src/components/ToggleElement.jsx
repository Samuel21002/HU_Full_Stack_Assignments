import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";

import Button from "@mui/material/Button";

const ToggleElement = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          onClick={toggleVisibility}
          size="small"
          type="submit"
          variant="outlined"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          onClick={toggleVisibility}
          size="small"
          type="submit"
          variant="outlined"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
});

ToggleElement.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

ToggleElement.displayName = "Togglable";

export default ToggleElement;
