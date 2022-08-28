import axios from 'axios'
import SignUpPage from './SignUpPage'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

describe('SignUpPage', () => {
  describe('Layout', () => {
    it('有一個 Todo-app HERO 大圖', () => {
      render(<SignUpPage />)
      const imageArr = screen.queryAllByRole('img')
      expect(imageArr[0].src).toContain('logo-check.png')
      expect(imageArr[1].src).toContain('todo-hero.png')
    })
    it('has header', () => {
      render(<SignUpPage />)
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
    `('form 有 => "$field" 的輸入框', ({ name, type }) => {
      const { container } = render(<SignUpPage />)
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
      render(<SignUpPage />)
      const label = screen.getByLabelText(labelName)
      expect(label).toBeInTheDocument()
    })
    it('有一註冊按鈕', () => {
      render(<SignUpPage />)
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeInTheDocument()
    })
    it('註冊按鈕預設不能點擊', () => {
      render(<SignUpPage />)
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeDisabled()
    })
  })
  describe('Interations', () => {
    it('當input框皆有輸入值時，按鈕可點擊', () => {
      render(<SignUpPage />)
      const emailInput = screen.getByLabelText('Email')
      const nicknameInput = screen.getByLabelText('您的暱稱')
      const password = screen.getByLabelText('密碼')
      const passwordAgain = screen.getByLabelText('再次輸入密碼')
      userEvent.type(emailInput, 'ha@gmail.com')
      userEvent.type(nicknameInput, 'hsuifang')
      userEvent.type(password, 'asdfasfd1')
      userEvent.type(passwordAgain, 'asdfasfd1')
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeEnabled()
    })
    it('當密碼及再次輸入密碼相同及都有輸入時，按鈕可點擊', () => {
      render(<SignUpPage />)
      const emailInput = screen.getByLabelText('Email')
      const nicknameInput = screen.getByLabelText('您的暱稱')
      const password = screen.getByLabelText('密碼')
      const passwordAgain = screen.getByLabelText('再次輸入密碼')
      userEvent.type(emailInput, 'ha@gmail.com')
      userEvent.type(nicknameInput, 'hsuifang')
      userEvent.type(password, 'asdfasfd12')
      userEvent.type(passwordAgain, 'asdfasfd1')
      const button = screen.queryByRole('button', { name: '註冊帳號' })
      expect(button).toBeDisabled()
    })

    fit('點擊註冊按鈕，將用戶email、暱稱、密碼送至後端API', async () => {
      // let reqBody;
      // const server = setupServer(
      //   rest.post('https://todoo.5xcamp.us/users', (req, res, ctx) => {
      //     req.body =
      //     return res(ctx.status(200))
      //   })
      // )

      render(<SignUpPage />)
      const emailInput = screen.getByLabelText('Email')
      const nicknameInput = screen.getByLabelText('您的暱稱')
      const password = screen.getByLabelText('密碼')
      const passwordAgain = screen.getByLabelText('再次輸入密碼')
      userEvent.type(emailInput, 'hsuifang@gmail.com')
      userEvent.type(nicknameInput, 'hsuifang')
      userEvent.type(password, 'asdf@123456')
      userEvent.type(passwordAgain, 'asdf@123456')
      const button = screen.queryByRole('button', { name: '註冊帳號' })

      const mockFn = jest.fn()
      axios.post = mockFn
      userEvent.click(button)

      const firstCallOfMockFn = mockFn.mock.calls[0]
      const body = firstCallOfMockFn[1]

      expect(body).toEqual({
        user: {
          email: 'hsuifang@gmail.com',
          nickname: 'hsuifang',
          password: 'asdf@123456',
        },
      })
    })
  })
})
