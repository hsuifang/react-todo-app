import axios from 'axios'
import store from '../state/store'

const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 15000,
})

service.interceptors.request.use((request) => {
  const { headers } = store.getState().authReduer
  if (headers) {
    request.headers['authorization'] = headers.authorization
  }
  return request
})

service.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const isLoginPage = window.location.hash.includes('#/login')
    if (error.response.status === 401 && !isLoginPage) {
      store.dispatch({ type: 'login_init' })
      window.location.assign('#/login')
      return
    }
    if (!window.navigator.onLine) {
      alert('網路出了點問題，請重新連線後重整網頁')
      return
    }
    return Promise.reject(error)
  }
)
// Users
export const signUp = (body) => {
  return service.post('/users', body)
}

export const signIn = (body) => {
  return service.post('/users/sign_in', body)
}

export const signOut = () => {
  return service.delete('/users/sign_out')
}

// Todos
export const loadTodos = () => {
  return service.get('/todos')
}

export const addTodo = (body) => {
  return service.post('/todos', body)
}

export const updateTodo = (id, body) => {
  return service.put(`/todos/${id}`, body)
}

export const deleteTodo = (id) => {
  return service.delete(`/todos/${id}`)
}

export const toggleTodo = (id) => {
  return service.patch(`/todos/${id}/toggle`)
}
