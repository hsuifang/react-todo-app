function TodoListItem({ todo }) {
  return (
    <li className='list-group-item' key={todo.id}>
      {!todo.status ? (
        <div className='d-flex align-items-center justify-content-between'>
          <div className='form-check d-flex align-items-center'>
            <input id={todo.id} className='form-check-input me-3' type='checkbox' />
            <label htmlFor={todo.id} className='form-check-label fs-7'>
              {todo.content}
            </label>
          </div>
          <div>
            <button type='button' className='btn btn-white btn-sm p-0 me-2'>
              <i className='bi bi-pencil-square'></i>
            </button>
            <button type='button' className='btn btn-white btn-sm p-0'>
              <i className='bi bi-x-lg'></i>
            </button>
          </div>
        </div>
      ) : (
        <div className='d-flex'>
          <i className='bi bi-check-lg text-primary pe-3'></i>
          <p className='text-info fs-7'>
            <del>{todo.content}</del>
          </p>
        </div>
      )}
    </li>
  )
}

export default TodoListItem
