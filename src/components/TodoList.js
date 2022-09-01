import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadTodos, toggleTodo, addTodo, deleteTodo, updateTodo } from '../api/apiCalls'
import NavTabs from './NavTabs'
import TodoListItem from './TodoListItem'
import TodoForm from './TodoForm'
import Spinner from './Spinner'
import noContentImage from '../assets/images/no-content.png'
import Modal from './Modal'

function TodoList() {
  // state:: TABS
  const [currentTab, setCurrentTab] = useState('all')
  const tabs = [
    { name: 'all', title: '全部' },
    { name: 'unfinished', title: '待完成' },
    { name: 'finished', title: '已完成' },
  ]
  // state:: Todo List
  const [deleteApiProgress, setDeleteApiProgress] = useState(false)
  const [updateApiProgress, setUpdateApiProgress] = useState(false)
  const [isEditItem, setIsEditItem] = useState(false)
  const [todos, setTodos] = useState([])
  const [visiableTodos, setVisiableTodos] = useState([])
  const [deleteContent, setDeleteContnet] = useState('')
  const [apiCall, setApiCall] = useState(false)
  const [editItem, setEditItem] = useState({})

  // state:: Modal
  const [modalVisible, setModalVisible] = useState(false)

  const changeTabStatus = (status) => {
    if (!status || status === currentTab) return
    setCurrentTab(status)
  }

  const fetchTodo = async () => {
    setApiCall(true)
    try {
      const res = await loadTodos()
      const { todos } = res.data
      setTodos(todos)
    } catch (error) {}
    setApiCall(false)
  }
  const handleAddItem = async ({ content }) => {
    if (!content) return
    try {
      const res = await addTodo({ todo: { content } })
      const result = res.data
      setTodos((prev) => [{ ...result, completed_at: '' }, ...prev])
    } catch (error) {}
  }
  const handleEditItem = async ({ id, content }) => {
    if (!content || !id) return
    setUpdateApiProgress(true)
    try {
      const res = await updateTodo(id, { todo: { content } })
      const result = res.data
      setTodos((prev) => [{ ...result, completed_at: '' }, ...prev])
      cancelEditField()
    } catch (error) {}
    setUpdateApiProgress(false)
  }
  const handleEditButton = (item) => {
    setEditItem(item)
    setIsEditItem(true)
  }
  const cancelEditField = () => {
    setIsEditItem(false)
    setEditItem({})
  }
  const handleToggleItem = async (id) => {
    try {
      const res = await toggleTodo(id)
      const items = todos.map((item) => (item.id === id ? { ...res.data } : item))
      setTodos(items)
    } catch (error) {}
  }

  //  TODO 可以做FP的練習
  const handleDeleteItem = async (id) => {
    setDeleteApiProgress(true)
    try {
      await deleteTodo(id)
      const newItems = todos.filter((item) => item.id !== id)
      setTodos(newItems)
      setDeleteContnet('')
      setModalVisible(false)
    } catch (error) {}
    setDeleteApiProgress(false)
  }

  // TODO 可以做FP的練習
  const clearCompleteTodos = async (e) => {
    e.preventDefault()
    const completeItems = todos.filter((todo) => todo.completed_at)
    for (let i = 0; i < completeItems.length; i++) {
      try {
        await deleteTodo(completeItems[i]['id'])
      } catch (error) {}
    }
    await fetchTodo()
  }

  useEffect(() => {
    fetchTodo()
  }, [])

  useEffect(() => {
    switch (currentTab) {
      case 'all':
        setVisiableTodos(todos)
        break
      case 'unfinished':
        setVisiableTodos(todos.filter((todo) => !todo.completed_at))
        break
      case 'finished':
        setVisiableTodos(todos.filter((todo) => todo.completed_at))
        break
      default:
        break
    }
  }, [currentTab, todos])

  return (
    <>
      <div className='container py-lg-3'>
        <div className='row g-0 justify-content-center align-items-center py-3'>
          <div className='col-lg-6'>
            <TodoForm
              handleAddItem={handleAddItem}
              handleEditItem={handleEditItem}
              handleCancel={cancelEditField}
              apiProgress={updateApiProgress}
              item={editItem}
            />
          </div>
          <div className='w-100'></div>
          {!isEditItem && (
            <div className='col-lg-6' data-testid='todos-list'>
              {todos.length ? (
                <div className='card shadow'>
                  <div className='card-header pt-0'>
                    <NavTabs current={currentTab} items={tabs} changeCurrent={changeTabStatus} />
                  </div>
                  <div className='card-body'>
                    <ul className='list-group list-group-flush border-bottom border-light'>
                      {visiableTodos.length ? (
                        visiableTodos.map((todo) => (
                          <TodoListItem
                            id={todo.id}
                            content={todo.content}
                            completed={Boolean(todo.completed_at)}
                            key={todo.id}
                            handleToggleItem={handleToggleItem}
                            handleDeleteItem={(item) => {
                              setDeleteContnet(item)
                              setModalVisible(true)
                            }}
                            handleEditItem={handleEditButton}
                          />
                        ))
                      ) : (
                        <li>
                          <p className='text-center mb-3'>目前尚無待辦事項</p>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className='card-footer'>
                    <div className='w-100 d-flex'>
                      {apiCall && <Spinner />}
                      <div className='d-flex justify-content-between w-100'>
                        <p className='fs-7' data-testid='count_uncomplete'>
                          {todos.filter((item) => !item.completed_at).length}個待完成項目
                        </p>
                        <Link className='text-info fs-7' to='/' onClick={clearCompleteTodos}>
                          清除已完成項目
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='row g-0 justify-content-center'>
                  <div className='col-lg-6'>
                    <p className='text-center mb-3'>目前尚無待辦事項</p>
                    <img
                      src={noContentImage}
                      alt='noContent-images'
                      className='d-none d-lg-block'
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {modalVisible && (
        <Modal
          content={`確定刪除待辦事項 - ${deleteContent.content}?`}
          onClickConfirm={() => handleDeleteItem(deleteContent.id)}
          onClickCancel={() => setModalVisible(false)}
          apiProgress={deleteApiProgress}
        />
      )}
    </>
  )
}

export default TodoList
