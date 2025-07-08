import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState:'',
  reducers: {
    setMessage(state, action) {
      return action.payload
    }
  }
});

export const { setMessage } = notificationSlice.actions
export const messageChange = (message, duration = 2) => {
  return dispatch => {
    dispatch(setMessage(message))
    setTimeout(() => {
      dispatch(setMessage(null))
    }, duration * 1000)
  }
}
export default notificationSlice.reducer