import { generatePassword } from '@repo/wenger-pkg'
import { useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

export const PasswordComponent: React.FC<BrickProps> = ({ onResult }) => {
   const [result, setResult] = useState('')
   useEffect(() => {
      if (result !== '') {
         return
      }
      const password = generatePassword()
      setResult(password)
      onResult(password)
   }, [result, onResult])
   return <pre>{result}</pre>
}

export const password: Brick = {
   id: 'password',
   name: 'Password',
   isEntry: true,
   component: PasswordComponent,
}
