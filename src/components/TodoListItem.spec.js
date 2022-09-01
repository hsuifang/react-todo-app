import { render, screen, waitFor } from '@testing-library/react'
import TodoListItem from './TodoListItem'
import userEvent from '@testing-library/user-event'

describe('Todo List Item', () => {
  it('狀態為false，項目有checkbox、編輯及刪除的選項', async () => {
    render(<TodoListItem id='1' content='2' completed={false} />)
    const checkbox = await screen.findByRole('checkbox')
    const editIcon = await screen.findByTestId('edit-icon')
    const deleteIcon = await screen.findByTestId('delete-icon')
    expect(checkbox).toBeInTheDocument()
    expect(editIcon).toBeInTheDocument()
    expect(deleteIcon).toBeInTheDocument()
  })
  it('狀態為true，項目沒有有checkbox、編輯、刪除的選項', () => {
    render(<TodoListItem id='1' content='2' completed={true} />)
    const checkbox = screen.queryByRole('checkbox')
    const editIcon = screen.queryByTestId('edit-icon')
    const deleteIcon = screen.queryByTestId('delete-icon')
    expect(checkbox).not.toBeInTheDocument()
    expect(editIcon).not.toBeInTheDocument()
    expect(deleteIcon).not.toBeInTheDocument()
  })
  it('點擊項目狀態改變', async () => {
    const onClick = jest.fn()
    render(<TodoListItem id='1' content='2' completed={true} onClick={onClick} />)
    const item = screen.queryByTestId('todo-item')
    userEvent.click(item)
    waitFor(async () => {
      const checkbox = await screen.findByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
    })
  })
})
