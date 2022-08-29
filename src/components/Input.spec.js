import { render, screen } from '@testing-library/react'

import Input from './Input'

describe('Input', () => {
  const setup = (help = '') => {
    return render(
      <Input
        id='inputName'
        name='inputName'
        help={help}
        label='label'
        onChange={() => function () {}}
      />
    )
  }
  it('當 help 有值時，<input/> 有 is-valid className', () => {
    const { container } = setup('Error Message')
    const input = container.querySelector('input')
    expect(input.classList).toContain('is-invalid')
  })
  it('當 help 有值時，<span></span> 有 invalid-feedback className', () => {
    const { container } = setup('Error Message')
    const span = container.querySelector('span')
    screen.debug()
    expect(span.classList).toContain('invalid-feedback')
  })
  it('當 help 「沒有」值時，<input/> 「沒有」 is-valid className', () => {
    const { container } = setup()
    const input = container.querySelector('input')
    expect(input.classList).not.toContain('is-invalid')
  })
  it('當 help 「沒有」值時，<span></span> 「沒有」 invalid-feedback className', () => {
    const { container } = setup()
    const span = container.querySelector('span')
    expect(span.classList).not.toContain('invalid-feedback')
  })
})
