import 'styles/theme.scss';
import { NextAuthProvider } from '@/providers/NextAuthProvider';

export const metadata = {
  title: 'RCS: Maple - RTPT',
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}

export default Layout
