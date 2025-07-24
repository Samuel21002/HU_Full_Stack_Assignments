import { useNotificationValue } from "../reducers/notificationContext";
import Alert from "@mui/material/Alert";

const Notification = () => {
  const message = useNotificationValue();

  if (message.value === null) {
    return null;
  }

  return (
    <div id="messageBox">
      <Alert icon={false} severity={message.isError ? "error" : "success"}>
        <em>{message.value}</em>
      </Alert>
    </div>
  );
};

export default Notification;
