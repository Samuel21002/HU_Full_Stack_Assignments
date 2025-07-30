import { useField } from "./customHook";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import PropTypes from "react-proptypes";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken, show }) => {
  const username = useField("text");
  const password = useField("password");

  const [loginUser, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("user-token", token);
    }
  }, [result.data]);

  const handleLogin = async (event) => {
    event.preventDefault();
    loginUser({
      variables: {
        username: username.attributes.value,
        password: password.attributes.value,
      },
    });
    username.resetfield();
    password.resetfield();
  };

  if (!show) return null;
  return (
    <form onSubmit={handleLogin}>
      <h3>Log In:</h3>
      Username:
      <div>
        <input {...username.attributes} />
      </div>
      Password:
      <div>
        <input {...password.attributes} />
      </div>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired,
  show: PropTypes.string
};
export default LoginForm;
