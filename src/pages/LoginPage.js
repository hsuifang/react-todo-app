import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { signIn } from '../api/apiCalls'
import HeroCover from '../components/HeroCover'
import Input from '../components/Input'
import Alert from '../components/Alert'
import ButtonWithProgress from '../components/ButtonWithProgress'

function LoginPage() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    err_email: '',
    err_password: '',
  })
  const [apiProgress, setApiProgress] = useState(false)
  const [failMessage, setFailMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiProgress(true)
    try {
      const { email, password } = userInfo
      const data = {
        user: {
          email,
          password,
        },
      }
      await signIn(data)
      navigate('/')
    } catch (error) {
      setFailMessage(error.response.data.message)
    }
    setApiProgress(false)
  }

  const updateUserData = (e) => {
    const { name, value } = e.target
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }))
  }

  useEffect(() => {
    setFailMessage('')
  }, [userInfo.email, userInfo.password])

  return (
    <div className='container py-5 vh-100' data-testid='login-page'>
      <div className='row flex-lg-column align-items-center justify-content-center h-100'>
        <div className='col-12'>
          <div className='row align-items-center'>
            <div className='col-12 col-lg-5 offset-lg-1'>
              <HeroCover />
            </div>
            <div className='col-12 col-lg-4 offset-lg-1'>
              <h2 className='fs-4 mb-4'>最實用的線上代辦事項服務</h2>
              <form onSubmit={handleSubmit}>
                <Input
                  id='email'
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='請輸入Email'
                  value={userInfo.email}
                  help={userInfo.err_email}
                  onChange={updateUserData}
                />
                <Input
                  id='password'
                  label='密碼'
                  name='password'
                  type='password'
                  value={userInfo.password}
                  help={userInfo.err_password}
                  onChange={updateUserData}
                />
                {failMessage && <Alert type='danger' text={failMessage} />}
                <div className='w-50 m-auto mb-4'>
                  <ButtonWithProgress
                    apiProgress={apiProgress}
                    disabled={!(userInfo.email && userInfo.password) || apiProgress}
                  >
                    登入
                  </ButtonWithProgress>
                </div>
                <div className='w-50 m-auto'>
                  <Link to='/sign-up' className='text-secondary d-block text-center fw-bold'>
                    註冊帳號
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
