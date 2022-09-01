import React from 'react'
import ButtonWithProgress from './ButtonWithProgress'

function Modal({
  content,
  confirmButton,
  cancelButton,
  onClickCancel,
  onClickConfirm,
  apiProgress,
}) {
  return (
    <div className='modal d-block show bg-secondary-70' tabIndex='-1' data-testid='modal'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onClickConfirm()
            }}
          >
            <div className='modal-body'>
              <p className='py-4'>{content}</p>
            </div>
            <div className='modal-footer'>
              <div className='d-flex'>
                <button
                  type='button'
                  className='btn btn-outline-secondary me-1'
                  style={{ width: '100px' }}
                  data-bs-dismiss='modal'
                  onClick={onClickCancel}
                >
                  {cancelButton}
                </button>
                <ButtonWithProgress apiProgress={apiProgress}>{confirmButton}</ButtonWithProgress>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

Modal.defaultProps = {
  confirmButton: '確認',
  cancelButton: '取消',
  onClickCancel: () => {},
  onClickConfirm: () => {},
  apiProgress: false,
}

export default Modal
