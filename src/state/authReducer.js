const reducer = (state = { isLoggin: false }, action) => {
  switch (action.type) {
    case 'login_init':
    case 'logout_success':
      return {
        isLoggedIn: false,
      }
    case 'login_success':
    case 'signup_success':
      return {
        ...state,
        isLoggedIn: true,
        ...action.payload,
      }
    default:
      return state
  }
}
export default reducer
