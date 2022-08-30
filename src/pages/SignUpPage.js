import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import loginHero from '../assets/images/todo-hero.png'
import logoCheck from '../assets/images/logo-check.png'

function SignUpPage() {
  const [enable, setEnable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signUpSuccess, setSignUpSucess] = useState(false)

  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordAgain: '',
    err_email: '',
    err_nickname: '',
    err_password: '',
    err_passwordAgain: '',
  })

  const [errorsMsg, setErrorsMsg] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      const { email, nickname, password } = userData
      axios.defaults.baseURL = 'https://todoo.5xcamp.us'
      await axios.post('/users', {
        user: { email, nickname, password },
      })
      setSignUpSucess(true)
      setLoading(false)
    } catch (error) {
      // regarless
      if (error.response.status === 422) {
        setErrorsMsg(error.response.data.error)
      }
      setLoading(false)
    }
  }
  const updateUserData = async (e) => {
    const { name, value } = e.target
    const data = {
      ...userData,
      [name]: value,
    }
    const { status, result } = validInput(name, data)
    setUserData(result)
    setEnable(status)

    if (errorsMsg.length) {
      setErrorsMsg([])
    }
  }

  const validInput = (name, data) => {
    const { email, nickname, password, passwordAgain } = data
    const allInput = email && nickname && password && passwordAgain
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    const emailMatch = emailRegex.test(email)
    const passwordSame = password === passwordAgain
    const buttonStatus = Boolean(allInput && passwordSame && emailMatch)

    if (name === 'password' || name === 'passwordAgain') {
      const errMsg = '密碼與再次輸入密碼需相同'
      return {
        status: buttonStatus,
        result: {
          ...data,
          err_password: passwordSame ? '' : errMsg,
          err_passwordAgain: passwordSame ? '' : errMsg,
        },
      }
    }

    if (name === 'email') {
      return {
        status: buttonStatus,
        result: {
          ...data,
          err_email: emailMatch ? '' : 'E-mail不符合格式',
        },
      }
    }

    return {
      status: buttonStatus,
      result: data,
    }
  }

  return (
    <div className='container py-5 vh-100' data-testid='sign-up-page'>
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
            <h2 className='mb-4'>註冊帳號</h2>
            {errorsMsg && (
              <ul>
                {errorsMsg.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}

            {signUpSuccess ? (
              <div className='alert alert-success' role='alert'>
                <p>註冊成功，前往TODO List頁面</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} data-testid='sign-up-form'>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  label='Email'
                  help={userData.err_email}
                  value={userData.email}
                  onChange={updateUserData}
                />

                <Input
                  id='nickname'
                  name='nickname'
                  label='您的暱稱'
                  value={userData.nickname}
                  help={userData.err_nickname}
                  onChange={updateUserData}
                />
                <Input
                  id='password'
                  name='password'
                  type='password'
                  label='密碼'
                  value={userData.password}
                  help={userData.err_password}
                  onChange={updateUserData}
                />
                <Input
                  id='passwordAgain'
                  name='passwordAgain'
                  type='password'
                  label='再次輸入密碼'
                  value={userData.passwordAgain}
                  help={userData.err_passwordAgain}
                  onChange={updateUserData}
                />

                <div className='w-50 m-auto mb-4'>
                  <button
                    className='btn btn-secondary w-100 fw-bold'
                    type='submit'
                    disabled={!enable || loading}
                  >
                    {loading && (
                      <span
                        className='spinner-grow spinner-grow-sm'
                        role='status'
                        aria-hidden='true'
                      ></span>
                    )}
                    註冊帳號
                  </button>
                </div>
              </form>
            )}
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
