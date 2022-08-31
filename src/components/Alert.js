import React from 'react'

function Alert({ type, text }) {
  return (
    <div className={`alert alert-${type}`}>
      <p>{text}</p>
    </div>
  )
}

Alert.defaultProps = {
  type: 'success',
}
export default Alert
