import { generatePassword } from '@repo/wenger-pkg'
import { useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

export const PasswordComponent: React.FC<BrickProps> = ({ onResult }) => {
   const [result, setResult] = useState('')
   if (result === '') {
      const password = generatePassword()
      setResult(password)
      onResult(password)
   }
   return <pre>{result}</pre>
}

export const password: Brick = {
   id: 'password',
   name: 'Password',
   isEntry: true,
   component: PasswordComponent,
}
