'use client'
import { Navbar, Image } from 'react-bootstrap'

const NavbarTop = props => {
  return (
    <Navbar expanded='lg' className='navbar-classic navbar navbar-expand-lg'>
      <div className='d-flex justify-content-between w-100'>
        <div className='d-flex align-items-center'>
          <Image
            src='/images/brand/logo/carleton.jpg'
            alt=''
            style={{ maxHeight: '3rem' }}
          />
        </div>

        <div className='navbar-right-wrap ms-2 d-flex nav-top-wrap mt-2'>
          <h3>Real Time Policy Tracker</h3>
        </div>
      </div>
    </Navbar>
  )
}

export { NavbarTop }
