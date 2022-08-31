function Spinner({ size }) {
  const spanClass = `spinner-grow ${size !== 'big' ? 'spinner-grow-sm' : ''}`
  return <span className={spanClass} role='status'></span>
}

export default Spinner
