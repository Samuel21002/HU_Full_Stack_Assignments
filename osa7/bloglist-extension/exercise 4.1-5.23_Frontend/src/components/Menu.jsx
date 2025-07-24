import { Link } from "react-router-dom";
import {
  useUserValue,
  useUserDispatch,
  logoutUser,
} from "../reducers/userContext";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Menu = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  const handleLogout = () => {
    logoutUser(userDispatch);
  };

  return (
    <AppBar position="static" sx={{ mb: '5px', height: '60px' }}>
      <Toolbar sx={{ minHeight: '50px', display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link style={{ color: 'white', textDecoration: 'none' }} to="/">
            All Blogs
          </Link>
          <Link style={{ color: 'white', textDecoration: 'none' }} to="/users">
            Users
          </Link>
        </Box>

        {/* Right side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography id="loggedInAs">
            Logged in as: <strong>{user.username}</strong>
          </Typography>
          <Button
            sx={{ color: '#fff' }}
            size="medium"
            id="logoutButton"
            onClick={handleLogout}
            variant="outlined"
          >
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
