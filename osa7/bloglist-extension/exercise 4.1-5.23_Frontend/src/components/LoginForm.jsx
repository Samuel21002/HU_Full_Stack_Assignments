import useField from "../customHook";
import { useNavigate } from "react-router-dom";
import { useUserDispatch, loginUser } from "../reducers/userContext";
import {
  useNotificationDispatch,
  setNotification,
} from "../reducers/notificationContext";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const LoginForm = () => {
  const username = useField("name");
  const password = useField("password");

  const navigateTo = useNavigate();
  const userDispatch = useUserDispatch();
  const notify = useNotificationDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    await loginUser(
      {
        username: username.attributes.value,
        password: password.attributes.value,
      },
      userDispatch,
      (msg, isError) => setNotification(notify, msg, 3, isError),
    );

    username.resetfield();
    password.resetfield();
    navigateTo("/");
  };

  return (
    <form onSubmit={handleLogin}>
      <Typography sx={{ mb: 2 }} variant="h3" component="h3">
        Log In:
      </Typography>
      <div>
        <TextField
          size="small"
          sx={{ mb: 0.5 }}
          id="username"
          label="Username"
          variant="outlined"
          {...username.attributes}
        />
      </div>
      <div>
        <TextField
          size="small"
          data-testid="password"
          id="password"
          label="Password"
          variant="outlined"
          sx={{ mb: 0.5 }}
          {...password.attributes}
        />
      </div>
      <br />
      <Button size="large" type="submit" variant="outlined">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
