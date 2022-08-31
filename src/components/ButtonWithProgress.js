import Spinner from './Spinner'
function ButtonWithProgress({ disabled, apiProgress, children }) {
  return (
    <button className='btn btn-secondary w-100 fw-bold' type='submit' disabled={disabled}>
      {apiProgress && <Spinner />}
      {children}
    </button>
  )
}

export default ButtonWithProgress
