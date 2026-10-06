import {
   type CharSet,
   charSets as charSetChars,
   generatePassword,
   type PasswordOptions,
} from '@repo/wenger-pkg'
import { useCallback, useEffect, useId, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks'

const MIN_LENGTH = 6
const MAX_LENGTH = 128
const PRESET_LENGTHS = [8, 16, 32, 48, 64]
const CHAR_SET_OPTIONS: { id: CharSet; label: string }[] = [
   { id: 'lowerchars', label: 'Lowercase' },
   { id: 'upperchars', label: 'Uppercase' },
   { id: 'digits', label: 'Digits' },
   { id: 'symbols', label: 'Symbols' },
]

export const PasswordComponent: React.FC<BrickProps> = ({ onResult }) => {
   const lengthId = useId()
   const [result, setResult] = useState('')
   const [length, setLength] = useState(48)
   const [charSets, setCharSets] = useState<CharSet[]>([
      'lowerchars',
      'upperchars',
      'digits',
      'symbols',
   ])
   // Takes the options as an argument so controls can generate with their new value
   // in the same event, before the state has re-rendered.
   const generate = useCallback(
      (options: PasswordOptions) => {
         const password = generatePassword(options)
         setResult(password)
         onResult(password)
      },
      [onResult],
   )
   // Generate after mount: during render it would differ between server and client
   // (hydration mismatch) and onResult would update the parent mid-render.
   useEffect(() => {
      if (result === '') {
         generate({ length, charSets })
      }
   }, [result, length, charSets, generate])
   const changeLength = (len: number) => {
      setLength(len)
      generate({ length: len, charSets })
   }
   const toggleCharSet = (id: CharSet, checked: boolean) => {
      // Keep the option order stable regardless of click order
      const next = CHAR_SET_OPTIONS.map((o) => o.id).filter((cs) =>
         cs === id ? checked : charSets.includes(cs),
      )
      setCharSets(next)
      generate({ length, charSets: next })
   }
   return (
      <div className="flex flex-col gap-3">
         <div className="flex max-w-md flex-col gap-1">
            <label htmlFor={lengthId} className="flex justify-between text-sm">
               <span>Length</span>
               <span className="font-mono tabular-nums">{length}</span>
            </label>
            <input
               id={lengthId}
               type="range"
               className="range range-xs range-primary w-full [--range-fill:0]"
               min={MIN_LENGTH}
               max={MAX_LENGTH}
               value={length}
               onChange={(e) => changeLength(Number(e.target.value))}
            />
            <div className="join mt-1">
               {PRESET_LENGTHS.map((preset) => (
                  <button
                     key={preset}
                     type="button"
                     className={`join-item btn btn-xs font-mono tabular-nums ${
                        preset === length ? 'btn-primary' : 'btn-soft'
                     }`}
                     aria-pressed={preset === length}
                     onClick={() => changeLength(preset)}
                  >
                     {preset}
                  </button>
               ))}
            </div>
         </div>
         <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
            <legend className="sr-only">Characters</legend>
            {CHAR_SET_OPTIONS.map(({ id, label }) => {
               const checked = charSets.includes(id)
               // The last selected set can't be unchecked: an empty selection would
               // silently fall back to the library defaults.
               const isLast = checked && charSets.length === 1
               return (
                  <label
                     key={id}
                     className="flex cursor-pointer items-center gap-2 text-sm"
                     title={charSetChars[id]}
                  >
                     <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary [--radius-selector:0.2rem]"
                        checked={checked}
                        disabled={isLast}
                        onChange={(e) => toggleCharSet(id, e.target.checked)}
                     />
                     {label}
                  </label>
               )
            })}
         </fieldset>
         <div className="flex items-center gap-2">
            <pre className="min-w-0 overflow-x-auto">{result}</pre>
            <button
               type="button"
               className="btn btn-square btn-ghost btn-sm"
               onClick={() => generate({ length, charSets })}
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
      </div>
   )
}

export const password: Brick = {
   id: 'password',
   name: 'Password',
   isEntry: true,
   component: PasswordComponent,
}
