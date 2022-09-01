import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import TodoList from './TodoList'
import userEvent from '@testing-library/user-event'

describe('Todo List', () => {
  const setup = () => {
    return render(
      <HashRouter>
        <TodoList />
      </HashRouter>
    )
  }
  describe('Layout', () => {
    it('有Todo 狀態的NavTabs 元件', () => {
      setup()
      waitFor(() => {
        const navTabs = screen.queryByTestId('nav-tabs')
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
          id: '9228f18c81d27c3f2b0fc15ff2732f3a',
          content: '閱讀 - 深度工作力',
          completed_at: '2022-08-31T14:47:41.056+08:00',
        },
        {
          id: 'fa8ca9720f16671539c4be006c5c67be',
          content: '資訊解構',
          completed_at: null,
        },
        {
          id: 'fdc883099f5cfd01a4211f26374fe9de',
          content: 'U - User List 搭配 TODO LIST',
          completed_at: '2022-09-01T14:47:41.056+08:00',
        },
      ],
    }
    let reqBody
    let counter = 0
    let deleteItemId
    const server = setupServer(
      rest.get(`${process.env.REACT_APP_BASE_URL}/todos`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(data))
      }),
      rest.post(`${process.env.REACT_APP_BASE_URL}/todos`, (req, res, ctx) => {
        reqBody = req.body
        return res(
          ctx.status(200),
          ctx.json({
            id: `adafasasdfasfdasdfasdf_${++counter}`,
            content: reqBody.todo.content,
          })
        )
      }),
      rest.put(`${process.env.REACT_APP_BASE_URL}/todos/:id`, (req, res, ctx) => {
        reqBody = req.body
        return res(ctx.status(200))
      }),
      rest.delete(`${process.env.REACT_APP_BASE_URL}/todos/:id`, (req, res, ctx) => {
        deleteItemId = req.params.id
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
    it('頁尾未完成的數量為 3個', async () => {
      setup() // 回傳的
      const text = await screen.findByText('3個待完成項目')
      expect(text).toBeInTheDocument()
    })
    it('點擊待完成的TAB, 資料呈現complete 有戳記的資料', async () => {
      setup() // 回傳的
      const unfinishedTab = await screen.findByText('待完成')
      userEvent.click(unfinishedTab)
      waitFor(() => {
        const todoItems = screen.queryAllByTestId('todo-item')
        expect(todoItems.length).toBe(3)
      })
    })
    it('點擊已完成的TAB, 資料呈現complete 有戳記的資料', async () => {
      setup() // 回傳的
      const finishedTab = await screen.findByText('已完成')
      userEvent.click(finishedTab)
      waitFor(() => {
        const todoItems = screen.queryAllByTestId('todo-item')
        expect(todoItems.length).toBe(2)
      })
    })
    it('將新增Todo資料的資料傳至後端', async () => {
      setup()
      const button = await screen.findByTestId('todo-form-add-button')
      const input = await screen.findByPlaceholderText('新增待辦事項')
      userEvent.type(input, '1. 新增NEW JOBS')
      userEvent.click(button)
      await waitFor(() => {
        expect(reqBody).toEqual({ todo: { content: '1. 新增NEW JOBS' } })
      })
    })
    it('新增資料時，項目增加在原先資料最上面', async () => {
      setup()
      const button = await screen.findByTestId('todo-form-add-button')
      const input = await screen.findByPlaceholderText('新增待辦事項')
      userEvent.type(input, '1. 新增NEW JOBS')
      userEvent.click(button)
      userEvent.type(input, '2. 新增NEW JOBS')
      userEvent.click(button)
      waitFor(() => {
        const items = screen.queryAllByTestId('todo-item')
        expect(items[0].textContent).toContain('2. 新增NEW JOBS')
      })
    })
    it('當沒有資料時，顯示目前尚未有事項', async () => {
      setup()
      server.use(
        rest.get(`${process.env.REACT_APP_BASE_URL}/todos`, (req, res, ctx) => {
          return res.once(ctx.status(200), ctx.json({ todos: [] }))
        })
      )
      const text = await screen.findByText('目前尚無待辦事項')
      expect(text).toBeInTheDocument()
    })
    it('點擊刪除按鈕，跳出確定刪除Modal資訊', async () => {
      setup()
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      const deleteIcon = await screen.findAllByTestId('delete-icon')
      userEvent.click(deleteIcon[0])
      const modal = screen.queryByTestId('modal')
      expect(modal).toBeInTheDocument()
    })
    it('顯示刪除的提問句、兩個按鈕', async () => {
      setup()
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      const deleteIcon = await screen.findAllByTestId('delete-icon')
      userEvent.click(deleteIcon[0])
      expect(screen.queryByText('確定刪除待辦事項 - 波蘭文複習?')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '確認' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: '取消' })).toBeInTheDocument()
    })
    it('點擊取消按鈕關閉視窗', async () => {
      setup()
      const deleteIcon = await screen.findAllByTestId('delete-icon')
      userEvent.click(deleteIcon[0])
      userEvent.click(screen.queryByRole('button', { name: '取消' }))
      const modal = screen.queryByTestId('modal')
      expect(modal).not.toBeInTheDocument()
    })
    it('呼叫刪除Api時有loading樣式', async () => {
      setup()
      const deleteIcon = await screen.findAllByTestId('delete-icon')
      userEvent.click(deleteIcon[0])
      userEvent.click(screen.queryByRole('button', { name: '確認' }))
      const spinner = screen.getByRole('status', { hidden: true })
      await waitForElementToBeRemoved(spinner)
    })
    it('點擊確定刪除按鈕，將id帶給後端', async () => {
      setup()
      const deleteIcon = await screen.findAllByTestId('delete-icon')
      userEvent.click(deleteIcon[0])
      userEvent.click(screen.queryByRole('button', { name: '確認' }))
      const spinner = screen.getByRole('status')
      await waitForElementToBeRemoved(spinner)
      expect(deleteItemId).toBe('99692bc89f2d1b238f93be11a265974a')
    })

    it('編輯項目時，將list表 隱藏', async () => {
      setup()
      expect(screen.queryByTestId('todos-list')).toBeInTheDocument()
      const editIcon = await screen.findAllByTestId('edit-icon')
      userEvent.click(editIcon[0])
      expect(screen.queryByTestId('todos-list')).not.toBeInTheDocument()
    })

    it('點擊編輯按鈕,將編輯的內容帶入form input', async () => {
      setup()
      expect(screen.queryByTestId('todos-list')).toBeInTheDocument()
      const editIcon = await screen.findAllByTestId('edit-icon')
      userEvent.click(editIcon[0])
      waitFor(() => {
        expect(screen.queryByText('波蘭文複習')).toBeInTheDocument()
      })
    })

    it('點擊取消編輯按鈕,清除資料', async () => {
      setup()
      expect(screen.queryByTestId('todos-list')).toBeInTheDocument()
      const editIcon = await screen.findAllByTestId('edit-icon')
      userEvent.click(editIcon[0])
      const cancelFormIcon = await screen.findByTestId('todo-form-cancel-button')
      userEvent.click(cancelFormIcon)
      const editTodoForm = screen.queryByPlaceholderText('編輯待辦事項')
      waitFor(() => {
        expect(editTodoForm).not.toBeInTheDocument()
        expect(screen.queryByTestId('todos-list')).toBeInTheDocument()
      })
    })
    // TODO 點擊更新按鈕呼叫API，有loading樣式
    // TODO 點擊更新按鈕呼叫API，更新資訊
  })
})
