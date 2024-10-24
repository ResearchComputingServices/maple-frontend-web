'use client'
import { useState, useEffect } from "react";


export async function* streamingFetch( input: RequestInfo | URL, init?: RequestInit ) {

    const response = await fetch( input, init)  
    // for await (const chunk of response.body) {
    //   console.log(chunk)
    // }
    console.log(response)
    const reader  = response.body!.getReader();
    console.log(reader)
    // await reader.closed
    reader.closed.then(() => console.log('reader closed'))
    const decoder = new TextDecoder("utf-8");

    for( ;; ) {
        const { done, value } = await reader.read()
        console.log('done: ', done)
        
        if( done ) break;

        try {
            console.log('value: ', value)
            // var chunk = decoder.decode(value)
            // console.log('chunk: ', chunk)
            yield decoder.decode(value)
        }
        catch( e:any ) {
            console.warn('error:', e.message )
        }

    }
}

export default function RenderStreamData() {
  const [data, setData] = useState<any[]>([]);

  useEffect( () => {

    const asyncFetch = async () => {
      const it = streamingFetch( '/config/summary') 
      // const it = streamingFetch( '/config/testroute') 
      console.log('it: ', it)
      

      for await ( let value of it ) {
        try {
          console.log('value: ', value)
          console.log(value)
          console.log(typeof value)
          // const chunk = JSON.parse(value)
          // setData( (prev) => [...prev, chunk]);
          setData( (prev) => [...prev, value]);
        }
        catch( e:any ) {
          console.warn( e.message )
        }
      }
    }

    const timerid = setTimeout( asyncFetch )
    
    return () => { clearTimeout(timerid) }
  }, []);

  return (
    <div>
        {data.map((chunk, index) => (
          <p key={index}>{`Received chunk ${index} - ${chunk}`}</p>
        ))}
    </div>
  );
}


export function StreamDataWithProgress() {
  const [data, setData] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);  

  useEffect( () => {

    const asyncFetch = async () => {
      const it = streamingFetch( '/config/testroute') 
      console.log('it: ', it)
      

      for await ( let value of it ) {
        try {
          const data = JSON.parse(value)
          console.log(data)
          setData( (prev) => prev + data['word'] + ' ')
          // const chunk = JSON.parse(value)
          // setData( (prev) => [...prev, chunk]);
          setProgress( data['progress']);
        }
        catch( e:any ) {
          console.warn( e.message )
        }
      }
    }

    const timerid = setTimeout( asyncFetch )
    
    return () => { clearTimeout(timerid) }
  }, []);

  return (
    <div>
        <textarea value={data} readOnly rows={6} className="w-100" />
        <div className="row w-100 ">
          <progress value={progress} max={100} className="col-sm-11" />
          <p className="col-sm-1">{progress}%</p>
        </div>
        
    </div>
  );
}