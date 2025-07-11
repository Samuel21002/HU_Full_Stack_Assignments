import {useNotificationValue} from '../context/notificationContext'

const Notification = () => {
  const value = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!value) return null
  
  return (
    <div style={style}>
      {value}
    </div>
  )
}
export default Notification
