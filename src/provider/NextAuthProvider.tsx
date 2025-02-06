'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, Suspense } from 'react'

type Props = {
  children?: React.ReactNode
}

export const NextAuthProvider = ({ children }: Props) => (
  <SessionProvider>
    <Suspense fallback={null}>{children}</Suspense>
  </SessionProvider>
)
