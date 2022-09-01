// import React from 'react'
// import { render } from '@testing-library/react'
// import { BrowserRouter as Router } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import store from '../state/store'

// const RootWrapper = ({ children }) => {
//   return (
//     <Router>
//       <Provider store={store}>{children}</Provider>
//     </Router>
//   )
// }
// const customRender = (ui, options) => render(ui, { wrapper: RootWrapper, ...options })

// export * from '@testing-library/react'
// export { customRender as render }

import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

// As a basic setup, import your same slice reducers
import authReducer from '../state/authReducer'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({ reducer: { authReducer }, preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
