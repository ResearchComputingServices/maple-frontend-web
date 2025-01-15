'use client'
import { Navbar, Image, Button } from 'react-bootstrap'
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';

const NavbarTop2 = props => {

  const router = useRouter();

  async function onClickLogout() {
    router.push('/logout');
  }

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
          <h3>Real Time Policy Tracker &nbsp;</h3>
          <Button variant="outline-info" onClick={() => {signOut({ callbackUrl: '/' });}}>Logout</Button>
        </div>
      </div>
    </Navbar>
  )
}

export { NavbarTop2 }
