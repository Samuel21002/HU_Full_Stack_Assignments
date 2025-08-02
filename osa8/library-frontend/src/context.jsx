/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { createContext, useReducer, useContext } from "react";

const initialNotificationState = {
  value: null,
  isError: false,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SetMessage":
      return {
        value: action.payload.value,
        isError: action.payload.isError || false,
      };
    case "Clear":
      return initialNotificationState;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [message, notificationDispatch] = useReducer(
    notificationReducer,
    initialNotificationState,
  );

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
export const setNotification = (
  dispatch,
  message,
  duration,
  isError = false,
) => {
  dispatch({
    type: "SetMessage",
    payload: { value: message, isError: isError },
  });
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
