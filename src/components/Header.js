import React from 'react'

function Header() {
  return (
    <div className='container-fluid py-3 px-4'>
      <div className='d-flex justify-content-between align-items-center mx-2'>
        <Brand />
        <ul className='d-flex'>
          <li className='me-4 fw-bold d-none d-lg-block'>王小明的代辦</li>
          <li>
            <Link to='/'>登出</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
