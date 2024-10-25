'use server'

function iteratorToStream(iterator: any) {
    return new ReadableStream({
      async pull(controller) {
        const { value, done } = await iterator.next()
   
        if (done) {
          controller.close()
        } else {
          controller.enqueue(value)
        }
      },
    })
  }
   
  function sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }
   
  const encoder = new TextEncoder()
   
  async function* makeIterator() {
    const text = "The Research Software Development team works with researchers to develop purpose-built software based on their needs in order to further their research programs. If you believe this service would be of value to you, please contact RCS. If you use the any custom software produced with the help of the Research Software Developement team as a part of your published research, it would be greatly appreciated if you could acknowledge RCS in your publication. Note: all Research Software Development projects are subject to our Standard Intellectual Property Terms and the Research Software Development team reserves the right to publicize any project on which they participate."
    const words = text.split(' ')
    for (let i = 0; i < words.length; i++) {
      const data = encoder.encode(
        JSON.stringify({
          word: words[i],
          progress: Math.round((i / (words.length-1)) * 100),
        })
      )
      yield data
      await sleep(50)
    }
    
    // yield encoder.encode('<p>One</p>')
    // await sleep(200)
    // yield encoder.encode('<p>Two</p>')
    // await sleep(200)
    // yield encoder.encode('<p>Three</p>')
  }
   
  export async function GET() {
    const iterator = makeIterator()
    const stream = iteratorToStream(iterator)
   
    return new Response(stream)
  }