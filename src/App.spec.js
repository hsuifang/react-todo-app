import { render, screen } from '@testing-library/react'
import App from './App'

describe('Routing', () => {
  const setup = (path) => {
    window.history.pushState({}, '', path)
    render(<App />)
  }

  it.each`
    name              | path          | pathTestId
    ${'TodoListPage'} | ${'/'}        | ${'todo-page'}
    ${'SignUpPage'}   | ${'/sign-up'} | ${'sign-up-page'}
    ${'LoginPage'}    | ${'/login'}   | ${'login-page'}
  `('當路徑為$name($path)時，顯示$name', ({ path, pathTestId }) => {
    setup(path)
    const page = screen.queryByTestId(pathTestId)
    expect(page).toBeInTheDocument()
  })

  it.each`
    path          | pathTestId
    ${'/'}        | ${'sign-up-page'}
    ${'/'}        | ${'login-page'}
    ${'/sign-up'} | ${'todo-page'}
    ${'/sign-up'} | ${'login-page'}
    ${'/login'}   | ${'todo-page'}
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
