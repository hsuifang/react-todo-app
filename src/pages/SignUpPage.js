import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import loginHero from '../assets/images/todo-hero.png'
import logoCheck from '../assets/images/logo-check.png'

function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [enable, setEnable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signUpSuccess, setSignUpSucess] = useState(false)

  const [userData, setUserData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordAgain: '',
  })
  console.log(errors)

  const [errorsMsg, setErrorsMsg] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      const { email, nickname, password } = userData
      await axios.post('/users', {
        user: { email, nickname, password },
      })
      setSignUpSucess(true)
    } catch (error) {
      // regarless
      if (error.response.status === 422) {
        setErrorsMsg(error.response.data.error)
      }
    } finally {
      setLoading(false)
    }
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
                  help={errors.email}
                  value={userData.email}
                  onChange={updateUserData}
                />
                {errors.email ? 'asdf' : 'asdfdd'}
                <Input
                  id='nickname'
                  name='nickname'
                  label='您的暱稱'
                  value={userData.nickname}
                  help={errors.nickname}
                  onChange={updateUserData}
                />
                <Input
                  id='password'
                  name='password'
                  type='password'
                  label='密碼'
                  value={userData.password}
                  help={errors.password}
                  onChange={updateUserData}
                />
                <Input
                  id='passwordAgain'
                  name='passwordAgain'
                  type='password'
                  label='再次輸入密碼'
                  value={userData.passwordAgain}
                  help={errors.passwordAgain}
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
