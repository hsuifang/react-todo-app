import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotFound from './pages/NotFound'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path='/' element={<HomePage />}></Route>
          <Route path='/sign-up' element={<SignUpPage />}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
