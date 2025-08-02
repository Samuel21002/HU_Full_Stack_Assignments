import { useNotificationValue } from "../context";

const Notification = () => {
  const message = useNotificationValue();

  const errorStyle = {
    display: 'flex',
    color: `${message.isError  ? 'red' : 'green'}`,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 18,
    padding: 10,
    margin: 5,
    border: `4px solid ${message.isError  ? 'red' : 'green'}`,
    background: '#eeeeee',
    borderRadius: 10
  }

  if (message.value === null) {
    return null
  }

  return (
    <div id="messageBox" style={errorStyle}>
      <br />
      <em>{message.value}</em>
    </div>
  )
};

export default Notification;
