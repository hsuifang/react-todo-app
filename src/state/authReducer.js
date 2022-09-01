const reducer = (state = { isLoggin: false }, action) => {
  switch (action.type) {
    case 'login_init':
      return {
        isLoggedIn: false,
      }
    case 'login_success':
      return {
        ...state,
        isLoggedIn: true,
        ...action.payload,
      }
    case 'logout_success':
      return {
        isLoggedIn: false,
      }
    default:
      return state
  }
}
export default reducer
