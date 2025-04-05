const Notification = ({notificationBody}) => {
    const errorStyle = {
        display: 'flex',
        color: `${notificationBody.isError ? 'red' : 'green'}`,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontSize: 18,
        padding: 10,
        margin: 5,
        border: `4px solid ${notificationBody.isError ? 'red' : 'green'}`,
        background: '#eeeeee',
        borderRadius: 10
      }

    if (notificationBody.message === null) {
        return null
    }

    return (
        <div style={errorStyle}>
        <br />
        <em>{notificationBody.message}</em>
      </div>
    )
}

export default Notification