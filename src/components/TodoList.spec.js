import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import TodoList from './TodoList'

describe('Todo List', () => {
  const setup = () => {
    return render(<TodoList />)
  }
  describe('Layout', () => {
    it('有Todo 狀態的NavTabs 元件', async () => {
      setup()
      const navTabs = await screen.findByTestId('nav-tabs')
      waitFor(() => {
        expect(navTabs).toBeInTheDocument()
      })
    })
  })

  describe('Interaction', () => {
    const data = {
      todos: [
        {
          id: '99692bc89f2d1b238f93be11a265974a',
          content: '波蘭文複習',
          completed_at: null,
        },
        {
          id: '9c223ec95479e20792c2db351befc581',
          content: 'U - Auth',
          completed_at: null,
        },
        {
          id: '1b5930f6a26c0d7a1f1a9167b820f474',
          content: 'U - Client State Management',
          completed_at: null,
        },
        {
          id: 'c30c20186a4d248128b34e89b9dd9679',
          content: 'TODO APP - Login',
          completed_at: null,
        },
        {
          id: '9228f18c81d27c3f2b0fc15ff2732f3a',
          content: '閱讀 - 深度工作力',
          completed_at: null,
        },
        {
          id: 'fa8ca9720f16671539c4be006c5c67be',
          content: '資訊解構',
          completed_at: null,
        },
        {
          id: 'fdc883099f5cfd01a4211f26374fe9de',
          content: 'U - User List 搭配 TODO LIST',
          completed_at: null,
        },
      ],
    }
    const server = setupServer(
      rest.get(`${process.env.REACT_APP_BASE_URL}/todos`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data))
      })
    )
    beforeAll(() => {
      server.listen()
    })
    afterAll(() => {
      server.close()
    })
    afterEach(() => {
      server.resetHandlers()
    })

    it('將Todo資料呈現在頁面', async () => {
      setup()
      // 找render 出來的 todo名稱
      const text = await screen.findByText('U - User List 搭配 TODO LIST')
      expect(text).toBeInTheDocument()
    })

    it('當fetch data時，有 loading 樣式', async () => {
      setup()
      const spinner = screen.getByRole('status')
      await screen.findByText('U - User List 搭配 TODO LIST')
      expect(spinner).not.toBeInTheDocument()
    })
  })
})
