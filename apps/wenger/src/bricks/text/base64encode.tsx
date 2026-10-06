import { useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

export const Base64EncodeComponent: React.FC<BrickProps> = ({ onResult, input }) => {
   const [result, setResult] = useState('')
   useEffect(() => {
      fetch(`/api/b/base64encode?input=${encodeURIComponent(input)}`).then(async (res) => {
         const data = await res.json()
         setResult(data.result)
         onResult(data.result)
      })
   }, [input, onResult])
   return <pre>{result}</pre>
}

export const base64encode: Brick = {
   id: 'base64encode',
   name: 'Base64 Encode',
   isEntry: false,
   component: Base64EncodeComponent,
}
