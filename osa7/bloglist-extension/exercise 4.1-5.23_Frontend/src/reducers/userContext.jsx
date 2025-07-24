// UserContext.jsx
import PropTypes from "prop-types";
import { createContext, useReducer, useContext } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserValue = () => useContext(UserContext)[0];
export const useUserDispatch = () => useContext(UserContext)[1];
export const loginUser = async (credentials, dispatch, notify) => {
  try {
    const user = await loginService.login(credentials);

    const session = {
      ...user,
      expiresAt: Date.now() + 5 * 60 * 1000, // Five minutes for testing purposes
    };

    window.localStorage.setItem("loggedInUser", JSON.stringify(session));
    blogService.setToken(user.token);
    dispatch({ type: "LOGIN", payload: user });

    notify && notify("Logged in successfully");
  } catch (error) {
    notify && notify("Wrong credentials", true);
  }
};
export const logoutUser = (dispatch) => {
  window.localStorage.clear();
  dispatch({ type: "LOGOUT" });
};

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
