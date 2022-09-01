import logoCheck from '../assets/images/logo-check.png'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../api/apiCalls'

function Header({ name }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logout = async (e) => {
    e.preventDefault()
    try {
      await signOut()
      dispatch({ type: 'logout_success' })
      navigate('/login')
    } catch (error) {}
  }

  return (
    <div className='container-fluid py-3 px-4'>
      <div className='d-flex justify-content-between align-items-center mx-2'>
        <div className='d-flex'>
          <img src={logoCheck} alt='login hero' width={40} className='obj-fit-contain' />
          <h1 className='fs-2 font-adorable'>ONLINE TODO LIST</h1>
        </div>
        <ul className='d-flex'>
          <li className='me-4 fw-bold d-none d-lg-block' data-test='profile-name'>
            {name}
          </li>
          <li>
            <Link to='/login' onClick={logout}>
              登出
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
