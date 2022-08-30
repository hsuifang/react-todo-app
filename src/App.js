import SignUpPage from './pages/SignUpPage'
import TodoPage from './pages/TodoPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  // <SignUpPage />
  // <Route path='/*' element={<NotFound />}></Route>
  return (
    <Router>
      <div className='container'>
        <Routes>
          <Route path='/' element={<TodoPage />}></Route>
          <Route path='/sign-up' element={<SignUpPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
