import { generatePassword } from '@repo/wenger-pkg'
import { useCallback, useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

export const PasswordComponent: React.FC<BrickProps> = ({ onResult }) => {
   const [result, setResult] = useState('')
   const refresh = useCallback(() => {
      const password = generatePassword()
      setResult(password)
      onResult(password)
   }, [onResult])
   // Generate after mount: during render it would differ between server and client
   // (hydration mismatch) and onResult would update the parent mid-render.
   useEffect(() => {
      if (result === '') {
         refresh()
      }
   }, [result, refresh])
   return (
      <div className="flex items-center gap-2">
         <pre className="min-w-0 overflow-x-auto">{result}</pre>
         <button
            type="button"
            className="btn btn-square btn-ghost btn-sm"
            onClick={refresh}
            aria-label="Generate new password"
            title="Generate new password"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="size-4"
               aria-hidden="true"
            >
               <path d="M21 12a9 9 0 1 1-2.64-6.36" />
               <path d="M21 3v6h-6" />
            </svg>
         </button>
      </div>
   )
}

export const password: Brick = {
   id: 'password',
   name: 'Password',
   isEntry: true,
   component: PasswordComponent,
}
