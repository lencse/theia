import { useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

export const Base64DecodeComponent: React.FC<BrickProps> = ({ onResult, input }) => {
   const [result, setResult] = useState('')
   const [error, setError] = useState('')
   useEffect(() => {
      fetch(`/api/b/base64decode?input=${encodeURIComponent(input)}`).then(async (res) => {
         const data = await res.json()
         if (!res.ok) {
            setResult('')
            setError(data.error)
            return
         }
         setError('')
         setResult(data.result)
         onResult(data.result)
      })
   }, [input, onResult])
   if (error) {
      return (
         <p role="alert" className="text-sm text-error">
            {error}
         </p>
      )
   }
   return <pre>{result}</pre>
}

export const base64decode: Brick = {
   id: 'base64decode',
   name: 'Base64 Decode',
   isEntry: false,
   component: Base64DecodeComponent,
}
