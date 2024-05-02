import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    process.env.PATH_URL_BACKEND_REMOTE + '/model-iteration/latest',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    },
  )
  const result = await res.json()
  console.log(
    '>>> app-api-modeltype:',
    process.env.PATH_URL_BACKEND_REMOTE + '/model-iteration/latest',
  )
  console.log('>> app-api-modeltype:', result)
  return NextResponse.json({ result })
}
