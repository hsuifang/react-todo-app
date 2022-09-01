import SignUpPage from './SignUpPage'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { renderWithProviders } from '../test/setup'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

describe('SignUpPage', () => {
  describe('Layout', () => {
    const setup = () => {
      return renderWithProviders(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )
    }
    it('有一個 Todo-app HERO 大圖', () => {
      setup()
      const heroComponent = screen.getByTestId('hero-cover')
      expect(heroComponent).toBeInTheDocument()
      // const imageArr = screen.queryAllByRole('img')
      // expect(imageArr[0].src).toContain('logo-check.png')
      // expect(imageArr[1].src).toContain('todo-hero.png')
    })
    it('has header', () => {
      setup()
      const header = screen.queryByRole('heading', { name: '註冊帳號' })
      expect(header).toBeInTheDocument()
    })
    // 檢查Form表單內的輸入框
    it.each`
      field             | name               | type
      ${'email'}        | ${'email'}         | ${'email'}
      ${'您的暱稱'}     | ${'nickname'}      | ${'text'}
      ${'密碼'}         | ${'password'}      | ${'password'}
      ${'再次輸入密碼'} | ${'passwordAgain'} | ${'password'}
    `('form 有 => "$field" 的輸入框', async ({ name, type }) => {
      const { container } = await setup()
      const input = container.querySelector(`input[name="${name}"][type="${type}"]`)
      expect(input).toBeInTheDocument()
    })
    it.each`
      labelName
      ${'Email'}
      ${'您的暱稱'}
      ${'密碼'}
      ${'再次輸入密碼'}
    `('form 有 => "$labelName" 的label名稱', ({ labelName }) => {
      setup()
      const label = screen.getByLabelText(labelName)
      expect(label).toBeInTheDocument()
    })
    it('有一註冊按鈕', () => {
      setup()
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeInTheDocument()
    })
    it('註冊按鈕預設不能點擊', () => {
      setup()
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeDisabled()
    })
    it('有一個倒頁到登入 login頁的按鈕', () => {
      setup()
      const link = screen.queryByRole('link', { name: '登入' })
      expect(link).toBeInTheDocument()
    })
  })
  describe('Interations', () => {
    let reqBody
    let counter = 0
    const server = setupServer(
      rest.post(`${process.env.REACT_APP_BASE_URL}/users`, (req, res, ctx) => {
        counter += 1
        reqBody = req.body
        return res(ctx.status(200))
      })
    )
    beforeAll(() => {
      server.listen()
    })
    afterAll(() => {
      server.close()
    })
    afterEach(() => {
      counter = 0
      server.resetHandlers()
    })
    // let button, password, passwordAgain
    const setup = () => {
      //  The component <Link/> needs to be wrapped by a <Router/> component.
      renderWithProviders(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      )
      const emailInput = screen.getByLabelText('Email')
      const nicknameInput = screen.getByLabelText('您的暱稱')
      const passwordInput = screen.getByLabelText('密碼')
      const passwordAgainInput = screen.getByLabelText('再次輸入密碼')
      userEvent.type(emailInput, 'hsuifang@gmail.com')
      userEvent.type(nicknameInput, 'hsuifang')
      userEvent.type(passwordInput, 'asdf@123456')
      userEvent.type(passwordAgainInput, 'asdf@123456')
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      return {
        button,
        password: passwordInput,
        passwordAgain: passwordAgainInput,
        email: emailInput,
      }
    }
    const generateErrorReq = () => {
      return rest.post(`${process.env.REACT_APP_BASE_URL}/users`, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({
            error: ['密碼 字數太少，至少需要 6 個字', '電子信箱 已被使用'],
            message: '註冊發生錯誤',
          })
        )
      })
    }
    it('當input框皆有輸入值時，按鈕可點擊', () => {
      const { button } = setup()
      expect(button).toBeEnabled()
    })
    it('當密碼及再次輸入密碼相同及都有輸入時，按鈕可點擊', () => {
      const { password, passwordAgain, button } = setup()
      userEvent.type(password, 'asdfasfd12')
      userEvent.type(passwordAgain, 'asdfasfd1')
      expect(button).toBeDisabled()
    })
    it('點擊註冊按鈕，將用戶email、暱稱、密碼送至後端API', async () => {
      const { button } = setup()
      userEvent.click(button)
      await screen.findByText('註冊成功，請前往首頁新增項目！')
      expect(reqBody).toEqual({
        user: {
          email: 'hsuifang@gmail.com',
          nickname: 'hsuifang',
          password: 'asdf@123456',
        },
      })
    })
    it('呼叫API時，按鈕不能再被點擊', async () => {
      const { button } = setup()
      userEvent.click(button)
      userEvent.click(button)
      await screen.findByText('註冊成功，請前往首頁新增項目！')
      expect(counter).toBe(1)
    })
    it('呼叫API時，按鈕有loading的樣式', async () => {
      const { button } = setup()
      userEvent.click(button)
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      await screen.findByText('註冊成功，請前往首頁新增項目！')
    })
    it('按鈕預設沒有loading的樣式', () => {
      setup()
      const spinner = screen.queryByRole('status', { hidden: true })
      expect(spinner).not.toBeInTheDocument()
    })
    it('註冊成功後，顯示啟用帳號資訊', async () => {
      const { button } = setup()
      const message = '註冊成功，請前往首頁新增項目！'
      expect(screen.queryByText(message)).not.toBeInTheDocument()
      userEvent.click(button)
      const text = await screen.findByText(message)
      expect(text).toBeInTheDocument()
    })
    it('點擊前往連結，轉倒至Home Page', async () => {
      const { button } = setup()
      userEvent.click(button)
      const link = await screen.findByRole('link', { name: '前往' })
      userEvent.click(link)
      waitFor(async () => {
        const homePage = await screen.findByTestId('home-page')
        expect(homePage).toBeInTheDocument()
      })
    })
    it('成功註冊後，form表單隱藏', async () => {
      const { button } = await setup()
      const form = screen.getByTestId('sign-up-form')
      userEvent.click(button)
      // wait for this form element to disapear
      await waitFor(() => {
        expect(form).not.toBeInTheDocument()
      })
      // await waitForElementToBeRemoved(form)
    })
    it('註冊信箱回傳狀態碼-422時，顯示錯誤訊息於頁面上', async () => {
      server.use(generateErrorReq())
      const { button } = setup()
      userEvent.click(button)
      const validationErrorFirst = await screen.findByText('密碼 字數太少，至少需要 6 個字')
      const validationErrorSecond = await screen.findByText('電子信箱 已被使用')
      expect(validationErrorFirst).toBeInTheDocument()
      expect(validationErrorSecond).toBeInTheDocument()
    })
    it('接收到API回傳442後，隱藏spinner和啟用按鈕', () => {
      server.use(generateErrorReq())
      const { button } = setup()
      userEvent.click(button)
      waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
        expect(button).toBeEnabled()
      })
    })
    // validation
    it('密碼與再次輸入密碼不符合時，顯示密碼不相同的訊息', () => {
      const { password, passwordAgain } = setup()
      userEvent.type(password, 'asdfasfd12')
      userEvent.type(passwordAgain, 'asdfasfd1')
      waitFor(async () => {
        const validationError = await screen.findByText('密碼與再次輸入密碼需相同')
        expect(validationError).toBeInTheDocument()
      })
    })
    it('email 不符合檢核時，顯示E-mail不符合格式的訊息', () => {
      const { email } = setup()
      userEvent.type(email, 'asdfasfd12')
      const validationError = screen.queryByText('E-mail不符合格式')
      expect(validationError).toBeInTheDocument()
    })
    it('當重新輸入資料時，清除api回傳422的訊息', async () => {
      server.use(generateErrorReq())
      const { button, password } = setup()
      userEvent.click(button)
      const validationErrorFirst = await screen.findByText('密碼 字數太少，至少需要 6 個字')
      const validationErrorSecond = await screen.findByText('電子信箱 已被使用')
      userEvent.type(password, 'asdfasdf')
      expect(validationErrorFirst).not.toBeInTheDocument()
      expect(validationErrorSecond).not.toBeInTheDocument()
    })
    it('點擊登入按紐，顯示login page', () => {
      setup()
      const link = screen.queryByRole('link', { name: '登入' })
      userEvent.click(link)
      expect(screen.queryByTestId('sign-up-page')).toBeInTheDocument()
    })
  })
})
