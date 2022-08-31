import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavTabs from './NavTabs'

describe('NavTabs', () => {
  const tabs = [
    { name: 'all', title: '全部' },
    { name: 'unfinished', title: '待完成' },
    { name: 'finished', title: '已完成' },
  ]
  const setup = () => {
    const current = 'all'
    const onChange = jest.fn()
    return render(<NavTabs current={current} items={tabs} changeCurrent={onChange} />)
  }

  it('將資料 load 到頁面', () => {
    const { container } = setup()
    const navItems = container.querySelectorAll('.nav-item')
    expect(navItems.length).toBe(3)
  })

  it('當前被選擇的nav-item (current === name)，其style className 有active', () => {
    setup()
    const activeItem = screen.queryByText('全部')
    expect(activeItem.classList).toContain('active')
  })

  it('點擊任一nav-item，被點擊的項目新增 active樣式，舊的items移除 active 樣式', () => {
    setup()
    const oldItem = screen.queryByText('全部')
    const newItem = screen.queryByText('待完成')
    userEvent.click(newItem)
    const oldItemClassList = oldItem.classList
    const newItemClassList = newItem.classList
    waitFor(() => {
      expect(oldItemClassList).not.toContain('active')
      expect(newItemClassList).toContain('active')
    })
  })
})
