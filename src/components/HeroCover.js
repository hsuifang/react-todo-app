import loginHero from '../assets/images/todo-hero.png'
import logoCheck from '../assets/images/logo-check.png'

function HeroCover() {
  return (
    <div data-testid='hero-cover'>
      <div className='d-flex mb-3 ms-lg-4 ps-lg-4 pb-1'>
        <img src={logoCheck} alt='login hero' width={40} className='obj-fit-contain' />
        <h1 className='fs-2 font-adorable'>ONLINE TODO LIST</h1>
      </div>
      <img src={loginHero} alt='login hero' className='d-none d-lg-block' />
    </div>
  )
}

export default HeroCover
