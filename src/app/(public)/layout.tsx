'use client'
import { NavbarTop } from 'app/_components/navbars'
import AppProvider from 'provider/AppProvider'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id='db-wrapper'>
      <div>
        <div className='header'>
          <NavbarTop />
        </div>
        <AppProvider>
          <section>{children}</section>
        </AppProvider>
      </div>
    </div>
  )
}

export default Layout
