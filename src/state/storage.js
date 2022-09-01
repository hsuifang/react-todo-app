import SecureLS from 'secure-ls'

const secureLS = new SecureLS()

const setItem = (key, value) => {
  secureLS.set(key, value)
}

const getItem = (key) => {
  return secureLS.get(key)
  // const storeState = localStorage.getItem(key)
  // if (!storeState) return null
  // try {
  //   return JSON.parse(storeState)
  // } catch (error) {
  //   return storeState
  // }
}

const clear = () => {
  secureLS.removeAll()
}

const storage = {
  setItem,
  getItem,
  clear,
}
export default storage
