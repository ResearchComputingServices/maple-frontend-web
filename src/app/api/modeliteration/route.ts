import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(process.env.PATH_URL_BACKEND_REMOTE + '/model-iteration?reduced=true&type=bert&complete=true', {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  })
  const result = await res.json()
  console.log(">> app-api-modeliteration:", result)
  return NextResponse.json({ result })
  // const res = await fetch(process.env.PATH_URL_BACKEND_LOCAL + '/test', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // })
  // const result = await res.json()
  // return NextResponse.json({ result })
}
