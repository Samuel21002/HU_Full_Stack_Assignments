/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  if (action.type === "Clear") {
    return "";
  }
  return action.payload;
};
const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [message, notificationDispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[message, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const counterAndDispatch = useContext(NotificationContext);
  return counterAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const counterAndDispatch = useContext(NotificationContext);
  return counterAndDispatch[1];
};

// Sets the message, unless duration is specified the message is persistent
export const setNotification = (dispatch, message, duration) => {
  dispatch({ type: "SetMessage", payload: message });
  if (duration) {
    setTimeout(() => {
      dispatch({ type: "Clear" });
    }, duration * 1000);
  }
};

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
