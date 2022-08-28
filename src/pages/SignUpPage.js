import axios from 'axios'
import { useState } from 'react'
import loginHero from '../assets/images/todo-hero.png'
import logoCheck from '../assets/images/logo-check.png'
import { Link } from 'react-router-dom'

function SignUpPage() {
  const [enable, setEnable] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordAgain: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, nickname, password } = userData
    axios.post('https://todoo.5xcamp.us/users', {
      user: { email, nickname, password },
    })
  }

  const updateUserData = async (e) => {
    const { name, value } = e.target
    const data = {
      ...userData,
      [name]: value,
    }
    setUserData(data)
    setEnable(validInput(data))
  }

  const validInput = ({ email, nickname, password, passwordAgain }) => {
    const allInput = email && nickname && password && passwordAgain
    const passwordSame = password === passwordAgain
    return Boolean(allInput && passwordSame)
  }

  return (
    <div className='container py-5 vh-100'>
      <div className='row flex-lg-column align-items-center justify-content-center h-100'>
        <div className='row align-items-center'>
          <div className='col-12 col-lg-5 offset-lg-1'>
            <div className='d-flex mb-3 ms-lg-4 ps-lg-4 pb-1'>
              <img src={logoCheck} alt='login hero' width={40} className='obj-fit-contain' />
              <h1 className='fs-2 font-adorable'>ONLINE TODO LIST</h1>
            </div>
            <img src={loginHero} alt='login hero' className='d-none d-lg-block' />
          </div>
          <div className='col-12 col-lg-4 offset-lg-1'>
            <h2>註冊帳號</h2>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  className='form-control mb-1'
                  placeholder='請輸入Email'
                  value={userData.email}
                  onChange={updateUserData}
                />
                <p className='text-danger fs-7'>此欄位不可為空</p>
              </div>
              <div className='form-group mb-3'>
                <label htmlFor='nickname' className='form-label'>
                  您的暱稱
                </label>
                <input
                  name='nickname'
                  id='nickname'
                  type='text'
                  className='form-control mb-1'
                  value={userData.nickname}
                  onChange={updateUserData}
                />
                <p className='text-danger fs-7'>此欄位不可為空</p>
              </div>
              <div className='form-group mb-3'>
                <label htmlFor='password' className='form-label'>
                  密碼
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  className='form-control mb-1'
                  value={userData.password}
                  onChange={updateUserData}
                />
                <p className='text-danger fs-7'>此欄位不可為空</p>
              </div>
              <div className='form-group mb-3'>
                <label htmlFor='passwordAgain' className='form-label'>
                  再次輸入密碼
                </label>
                <input
                  id='passwordAgain'
                  name='passwordAgain'
                  type='password'
                  className='form-control mb-1'
                  value={userData.passwordAgain}
                  onChange={updateUserData}
                />
                <p className='text-danger fs-7'>此欄位不可為空</p>
              </div>
              <div className='w-50 m-auto mb-4'>
                <button
                  className='btn btn-secondary w-100 fw-bold'
                  type='submit'
                  disabled={!enable}
                >
                  註冊帳號
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
  // <div className='w-50 m-auto'>
  //   <Link to='/login' className='text-secondary d-block text-center fw-bold'>
  //     登入
  //   </Link>
  // </div>
}

export default SignUpPage
