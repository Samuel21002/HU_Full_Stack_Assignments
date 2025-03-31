const Message = ({messageBody}) => {
    const errorStyle = {
        display: 'flex',
        color: `${messageBody.isError ? 'red' : 'green'}`,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fontSize: 18,
        padding: 10,
        margin: 5,
        border: `4px solid ${messageBody.isError ? 'red' : 'green'}`,
        background: '#eeeeee',
        borderRadius: 10
      }

    if (messageBody.message === null) {
        return null
    }

    return (
        <div style={errorStyle}>
        <br />
        <em>{messageBody.message}</em>
      </div>
    )
}

export default Message