import React from 'react'
import PropTypes from 'prop-types'

function Input({ id, name, type, value, label, placeholder, help, onChange }) {
  return (
    <div className='form-group mb-3'>
      <label htmlFor={id} className='form-label'>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={`form-control mb-1 ${help ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <span className={`fs-7 ${help ? 'invalid-feedback' : ''}`}>{help}</span>
    </div>
  )
}
// ref={register}

Input.defaultProps = {
  type: 'text',
}
Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  help: PropTypes.string,
  register: PropTypes.object,
}

export default Input
