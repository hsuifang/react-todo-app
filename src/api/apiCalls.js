import axios from 'axios'
const service = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 15000,
})

service.interceptors.request.use((request) => {
  request.headers['Authorization'] =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyNjEiLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE2NjE5MDkyMTgsImV4cCI6MTY2MzIwNTIxOCwianRpIjoiNDE1NWQ2ZGYtMzQ2NS00YWJjLWI4YWYtY2ZkMWYyMDYzZGJmIn0.eaoAVzZVgRbl6SImn3uTej1KM9IxW8wXlSFVfi5lmT0'
  return request
})

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

export const addTodo = () => {
  return service.post('/todos')
}

export const updateTodo = (id) => {
  return service.put(`/todos/${id}`)
}

export const deleteTodo = (id) => {
  return service.delete(`/todos/${id}`)
}

export const toggleTodo = (id) => {
  return service.patch(`/todos/${id}/toggle`)
}
