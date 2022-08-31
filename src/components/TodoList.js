import { useEffect, useState } from 'react'
import { loadTodos } from '../api/apiCalls'
import NavTabs from './NavTabs'
import TodoListItem from './TodoListItem'
import Spinner from './Spinner'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [apiCall, setApiCall] = useState(false)

  const fetchTodo = async () => {
    setApiCall(true)
    try {
      const res = await loadTodos()
      const { todos } = res.data
      setTodos(todos)
    } catch (error) {}
    setApiCall(false)
  }

  useEffect(() => {
    fetchTodo()
  }, [])

  return (
    <div className='container py-lg-3'>
      <div className='row g-0 justify-content-center align-items-center py-3'>
        <div className='col-lg-6 pt-lg-6'>
          <div className='card shadow'>
            <div className='card-header'>
              <NavTabs />
            </div>
            <div className='card-body'>
              <ul className='list-group list-group-flush border-bottom border-light'>
                {todos.map((todo) => (
                  <TodoListItem todo={todo} key={todo.id} />
                ))}
              </ul>
            </div>
            <div className='card-footer'>
              <p>夜腳</p>
              {apiCall && <Spinner />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoList
