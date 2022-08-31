function NavTabs({ current, changeCurrent, items = [] }) {
  return (
    <ul
      className='nav nav-tabs card-header-tabs border-2 border-bottom border-light'
      data-testid='nav-tabs'
    >
      {items.map((tab) => (
        <li className='nav-item flex-grow-1' key={tab.name}>
          <input
            type='button'
            name={tab.name}
            className={`nav-link ${
              tab.name === current ? 'active' : ''
            } text-center fs-7 text-info d-block w-100`}
            value={tab.title}
            onClick={(e) => {
              changeCurrent(e.target.name)
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export default NavTabs
