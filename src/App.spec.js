import { screen, act, waitFor } from '@testing-library/react'
import { renderWithProviders } from './test/setup'
import App from './App'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import storage from './state/storage'

let logoutCount = 0
const server = setupServer(
  rest.post(`${process.env.REACT_APP_BASE_URL}/users/sign_in`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: '登入成功', email: 'fangfang@gmail.com', nickname: 'fangfang' })
    )
  }),
  rest.delete(`${process.env.REACT_APP_BASE_URL}/users/sign_out`, (req, res, ctx) => {
    logoutCount += 1
    return res(ctx.status(200))
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
  return renderWithProviders(<App />)
}

describe('Routing', () => {
  it.each`
    name            | path          | pathTestId
    ${'HomePage'}   | ${'/'}        | ${'home-page'}
    ${'SignUpPage'} | ${'/sign-up'} | ${'sign-up-page'}
    ${'LoginPage'}  | ${'/login'}   | ${'login-page'}
  `('當路徑為$name($path)時，顯示$name', async ({ path, pathTestId }) => {
    await act(() => {
      setup(path)
    })
    waitFor(async () => {
      const page = await screen.findByTestId(pathTestId)
      expect(page).toBeInTheDocument()
    })
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
    waitFor(async () => {
      const page = await screen.findByTestId(pathTestId)
      expect(page).not.toBeInTheDocument()
    })
  })
  it('當找不到對應網址的頁面時，顯示NOT Found', () => {
    setup('/404')
    const page = screen.queryByTestId('not-found-page')
    expect(page).toBeInTheDocument()
  })
})

describe('Login', () => {
  const setupLoggedIn = () => {
    setup('/login')
    userEvent.type(screen.getByLabelText('Email'), 'fasdf@gmail.com')
    userEvent.type(screen.getByLabelText('密碼'), 'faasdf')
    const button = screen.getByRole('button', { name: '登入' })
    userEvent.click(button)
  }
  it('成功登入後，轉導頁面至 home page', () => {
    setupLoggedIn()
    waitFor(async () => {
      const page = await screen.findByTestId('home-page')
      expect(page).toBeInTheDocument()
    })
  })
  it('儲存登入資料在localStorage', () => {
    setupLoggedIn()
    waitFor(async () => {
      const page = await screen.findByTestId('home-page')
      expect(page).toBeInTheDocument()
      const state = storage('auth')
      expect(state).toBeTruthy()
    })
  })
  it('成功登入後，呈現登入者的名字', () => {
    setupLoggedIn()
    waitFor(async () => {
      const profileName = await screen.findByTestId('profie-name')
      expect(profileName).toBeInTheDocument()
    })
  })
})

describe('Logout', () => {
  let logoutLink
  const setupLoggedIn = () => {
    storage.setItem('auth', {
      nickname: 'user5',
      isLoggedIn: true,
      header: 'auth header value',
    })
    setup('/')
    logoutLink = screen.queryByRole('link', { name: '登出' })
  }
  it('當登入後，有一個登出的按鈕在header', () => {
    setupLoggedIn()
    expect(logoutLink).toBeInTheDocument()
  })
  it('點擊登出回到登入頁面', () => {
    setupLoggedIn()
    userEvent.click(logoutLink)
    waitFor(async () => {
      const loginPage = await screen.findByTestId('login-page')
      expect(loginPage).toBeInTheDocument()
    })
  })
  it('點擊登出回到登入頁面呼叫API', () => {
    setupLoggedIn()
    userEvent.click(logoutLink)
    waitFor(async () => {
      await screen.findByRole('link', { name: '登出' })
      expect(logoutCount).toBe(1)
    })
  })
})

describe('unAuth', () => {
  it('當沒有在首頁沒有auth檢核成功時，轉倒頁面到login', () => {
    setup('/')
    waitFor(async () => {
      const loginPage = await screen.findByTestId('login-page')
      expect(loginPage).toBeInTheDocument()
    })
  })
})
