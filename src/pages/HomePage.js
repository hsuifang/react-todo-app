import React from 'react'
import TodoList from '../components/TodoList'

function HomePage() {
  return (
    <div data-testid='home-page'>
      <TodoList />
    </div>
  )
}

export default HomePage
