import { configureStore } from '@reduxjs/toolkit'
import authReduer from './authReducer'
import storage from '../state/storage'

const initialState = storage.getItem('auth') || {
  isLoggedIn: false,
}

const store = configureStore({
  reducer: { authReduer },
  preloadedState: { authReduer: initialState },
})

store.subscribe(() => {
  storage.setItem('auth', store.getState().authReduer)
})

export default store
