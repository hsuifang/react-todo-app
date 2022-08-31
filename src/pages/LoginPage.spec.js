import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import LoginPage from './LoginPage'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

let requestBody,
  count = 0
const server = setupServer(
  rest.post(`${process.env.REACT_APP_BASE_URL}/users/sign_in`, (req, res, ctx) => {
    count += 1
    requestBody = req.body
    return res(ctx.status(200))
  })
)

const generateErrorReq = () => {
  return rest.post(`${process.env.REACT_APP_BASE_URL}/users/sign_in`, (req, res, ctx) => {
    return res.once(
      ctx.status(401),
      ctx.json({
        message: '登入錯誤',
      })
    )
  })
}
beforeAll(() => {
  server.listen()
})
afterAll(() => {
  server.close()
})

beforeEach(() => {
  count = 0
  server.resetHandlers()
})

describe('Login Page', () => {
  describe('Layout', () => {
    const setup = () => {
      return render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )
    }
    it('有一個 Todo-app HERO 大圖', () => {
      setup()
      const heroComponent = screen.getByTestId('hero-cover')
      expect(heroComponent).toBeInTheDocument()
    })

    it('has header', () => {
      setup()
      const header = screen.queryByRole('heading', { name: '最實用的線上代辦事項服務' })
      expect(header).toBeInTheDocument()
    })
    // 檢查Form表單內的輸入框
    it.each`
      field      | name          | type
      ${'email'} | ${'email'}    | ${'email'}
      ${'密碼'}  | ${'password'} | ${'password'}
    `('form 有 => "$field" 的輸入框', async ({ name, type }) => {
      const { container } = setup()
      const input = container.querySelector(`input[name="${name}"][type="${type}"]`)
      expect(input).toBeInTheDocument()
    })
    it.each`
      labelName
      ${'Email'}
      ${'密碼'}
    `('form 有 => "$labelName" 的label名稱', ({ labelName }) => {
      setup()
      const label = screen.getByLabelText(labelName)
      expect(label).toBeInTheDocument()
    })
    it('有一登入按鈕', () => {
      setup()
      const button = screen.queryByRole('button', { name: '登入' })
      expect(button).toBeInTheDocument()
    })
    it('登入按鈕預設不能點擊', () => {
      setup()
      const button = screen.queryByRole('button', { name: '登入' })
      expect(button).toBeDisabled()
    })
    it('有一個倒頁到註冊 login頁的按鈕', () => {
      setup()
      const link = screen.queryByRole('link', { name: '註冊帳號' })
      expect(link).toBeInTheDocument()
    })
  })
  describe('Interactions', () => {
    const setup = () => {
      render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      )
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('密碼')

      userEvent.type(emailInput, 'hsuifang@gmail.com')
      userEvent.type(passwordInput, 'asdfasdf123456')

      const button = screen.queryByRole('button', { name: '登入' })
      return {
        button,
        passwordInput,
        emailInput,
      }
    }
    it('當Email及密碼皆有輸入值後，按鈕方可點擊', () => {
      const { button } = setup()
      expect(button).toBeEnabled()
    })
    it('呼叫API時，按鈕有loading的樣式', async () => {
      const { button } = setup()
      expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument()
      userEvent.click(button)
      const spinner = screen.getByRole('status', { hidden: true })
      await waitForElementToBeRemoved(spinner)
    })
    it('點擊登入按鈕，將email 及 密碼的資料送至後端API', async () => {
      const { button } = setup()
      userEvent.click(button)
      const spinner = screen.getByRole('status', { hidden: true })
      await waitForElementToBeRemoved(spinner) // 表一個request 結束
      expect(requestBody).toEqual({
        user: {
          email: 'hsuifang@gmail.com',
          password: 'asdfasdf123456',
        },
      })
    })
    it('呼叫API時，按鈕不能被點擊', async () => {
      const { button } = setup()
      userEvent.click(button)
      userEvent.click(button)
      expect(button).toBeDisabled()
      const spinner = screen.getByRole('status', { hidden: true })
      await waitForElementToBeRemoved(spinner)
      expect(count).toBe(1)
    })
    it('當登入失敗時，顯示錯誤訊息', async () => {
      server.use(generateErrorReq())
      const { button } = setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('登入錯誤')
      expect(errorMessage).toBeInTheDocument()
    })
    it('當重新輸入email後，清除錯誤訊息', async () => {
      server.use(generateErrorReq())
      const { button, emailInput } = setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('登入錯誤')
      expect(errorMessage).toBeInTheDocument()
      userEvent.type(emailInput, 'asdf@gmail.com')
      expect(errorMessage).not.toBeInTheDocument()
    })
    it('當重新輸入密碼後，清除錯誤訊息', async () => {
      server.use(generateErrorReq())
      const { button, passwordInput } = setup()
      userEvent.click(button)
      const errorMessage = await screen.findByText('登入錯誤')
      expect(errorMessage).toBeInTheDocument()
      userEvent.type(passwordInput, 'aasdf')
      expect(errorMessage).not.toBeInTheDocument()
    })
  })
})
