import PropTypes from 'prop-types'
function TodoListItem({
  id,
  content,
  completed,
  handleToggleItem,
  handleDeleteItem,
  handleEditItem,
}) {
  return (
    <li className='list-group-item' key={id} data-testid='todo-item' style={{ cursor: 'pointer' }}>
      {!completed ? (
        <div className='d-flex align-items-center justify-content-between'>
          <div
            className='form-check d-flex align-items-center'
            onClick={() => {
              handleToggleItem(id)
            }}
          >
            <input id={id} className='form-check-input me-3' type='checkbox' />
            <label htmlFor={id} className='form-check-label fs-7' style={{ cursor: 'pointer' }}>
              {content}
            </label>
          </div>
          <div>
            <button
              type='button'
              className='btn btn-white btn-sm p-0 me-2 btn-primary-hover'
              data-testid='edit-icon'
              onClick={(e) => {
                e.stopPropagation()
                handleEditItem({ id, content, completed })
              }}
            >
              <i className='bi bi-pencil-square'></i>
            </button>
            <button
              type='button'
              className='btn btn-sm p-0 btn-primary-hover'
              data-testid='delete-icon'
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteItem({ id, content })
              }}
            >
              <i className='bi bi-x-lg'></i>
            </button>
          </div>
        </div>
      ) : (
        <div
          className='d-flex'
          onClick={() => {
            handleToggleItem(id)
          }}
        >
          <i className='bi bi-check-lg text-primary pe-3'></i>
          <p className='text-info fs-7'>
            <del>{content}</del>
          </p>
        </div>
      )}
    </li>
  )
}

TodoListItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  completed: PropTypes.bool,
}

export default TodoListItem
