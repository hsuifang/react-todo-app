import { useEffect, useState } from 'react'

function TodoForm({ item = {}, handleAddItem, handleEditItem, handleCancel, apiProgress }) {
  const [input, setInput] = useState('')

  const submitAddItem = (e) => {
    e.preventDefault()
    if (item.id) {
      handleEditItem({ content: input, id: item.id })
    } else {
      handleAddItem({ content: input })
    }
    setInput('')
  }

  useEffect(() => {
    if (item.id) {
      setInput(item.content)
    }
  }, [item])

  return (
    <form className='mb-3' onSubmit={submitAddItem} data-testid='todo-form'>
      <div className='mb-3 form-group rounded d-flex bg-white'>
        <input
          type='text'
          name='todo-item'
          id='todo-item'
          className='form-control'
          placeholder={`${item.id ? '編輯' : '新增'}待辦事項`}
          aria-describedby='helpId'
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
        />
        {!item.id ? (
          <button
            data-testid='todo-form-add-button'
            className='btn btn-secondary m-1'
            type='submit'
            disabled={apiProgress}
          >
            <i className='bi bi-plus-lg'></i>
          </button>
        ) : (
          <>
            <button
              className='btn btn-light m-1'
              type='button'
              data-testid='todo-form-cancel-button'
              onClick={() => {
                setInput('')
                handleCancel()
              }}
            >
              <i className='bi bi-x-circle'></i>
            </button>
            <button
              className='btn btn-secondary m-1'
              type='submit'
              data-testid='todo-form-edit-button'
              disabled={apiProgress}
            >
              <i className='bi bi-pencil-square'></i>
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default TodoForm
