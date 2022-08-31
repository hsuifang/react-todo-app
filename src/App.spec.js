import { render, screen } from '@testing-library/react'
import App from './App'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.post(`${process.env.REACT_APP_BASE_URL}/users/sign_in`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: '登入成功', email: 'fangfang@gmail.com', nickname: 'fangfang' })
    )
  }),
  rest.get(`${process.env.REACT_APP_BASE_URL}/todos`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(data))
  })
)

beforeEach(() => {
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = (path) => {
  window.history.pushState({}, '', `#${path}`)
  render(<App />)
}

describe('Routing', () => {
  it.each`
    name              | path          | pathTestId
    ${'TodoListPage'} | ${'/'}        | ${'home-page'}
    ${'SignUpPage'}   | ${'/sign-up'} | ${'sign-up-page'}
    ${'LoginPage'}    | ${'/login'}   | ${'login-page'}
  `('當路徑為$name($path)時，顯示$name', async ({ path, pathTestId }) => {
    setup(path)
    const page = await screen.findByTestId(pathTestId)
    expect(page).toBeInTheDocument()
  })

  it.each`
    path          | pathTestId
    ${'/'}        | ${'sign-up-page'}
    ${'/'}        | ${'login-page'}
    ${'/sign-up'} | ${'home-page'}
    ${'/sign-up'} | ${'login-page'}
    ${'/login'}   | ${'home-page'}
    ${'/login'}   | ${'sign-up-page'}
  `('當路徑為($path)時，不顯示$pathTestId', ({ path, pathTestId }) => {
    setup(path)
    const page = screen.queryByTestId(pathTestId)
    expect(page).not.toBeInTheDocument()
  })

  it('當找不到對應網址的頁面時，顯示NOT Found', () => {
    setup('/404')
    const page = screen.queryByTestId('not-found-page')
    expect(page).toBeInTheDocument()
  })
})

describe('Login', () => {
  it('成功登入後，轉導頁面至 home page', async () => {
    setup('/login')
    userEvent.type(screen.getByLabelText('Email'), 'fasdf@gmail.com')
    userEvent.type(screen.getByLabelText('密碼'), 'faasdf')
    const button = screen.getByRole('button', { name: '登入' })
    userEvent.click(button)
    const page = await screen.findByTestId('home-page')
    expect(page).toBeInTheDocument()
  })
})
