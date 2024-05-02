import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Get query params from request
  const {searchParams} = new URL(request.url)

  // Parse params
  const unsanitizedUuid = searchParams.get('uuid') || ''

  // Sanitize the uuid
  const sanitizedUuid = encodeURI(unsanitizedUuid)

  // No uuid? Bail...
  if (!sanitizedUuid) {
    return new Response(JSON.stringify({error: 'No uuid provided.'}), {
      status: 400,
      statusText: 'Bad Request'
    })
  }
  console.log(">> app-api-topiclist-sanitizedUuid:", sanitizedUuid)

  const res = await fetch(process.env.PATH_URL_BACKEND_REMOTE + `/model-iteration?uuid=${sanitizedUuid}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 },
  })
  const result = await res.json()
  console.log(">> app-api-topiclist:", result)
  return NextResponse.json({ result })
}
