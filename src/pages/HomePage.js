import Header from '../components/Header'
import TodoList from '../components/TodoList'
import store from '../state/store'

function HomePage() {
  const { nickname } = store.getState().authReduer
  return (
    <div className='todo-bg min-vh-100' data-testid='home-page'>
      <Header name={nickname} />
      <div className='container'>
        <TodoList />
      </div>
    </div>
  )
}

export default HomePage
