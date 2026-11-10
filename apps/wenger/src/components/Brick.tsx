import { useEffect, useState } from 'react'
import type { Brick, BrickProps } from '#/bricks/bricks.tsx'

export type BrickComponentProps = BrickProps & {
   brick: Brick
   // The brick's latest result, which the copy button copies
   result: string
   // Shows a delete button when given
   onDelete?: () => void
}

export const BrickComponent: React.FC<BrickComponentProps> = ({
   brick,
   input,
   result,
   onResult,
   onDelete,
}) => {
   const Component = brick.component
   return (
      <div className="card bg-base-100 w-4xl shadow-sm border border-upset-tomato-900">
         <div className="card-body">
            <div className="mb-4 flex items-center justify-between gap-2">
               <h2 className="card-title">{brick.name}</h2>
               <div className="flex gap-1">
                  <CopyButton text={result} label={`Copy ${brick.name} result`} />
                  {onDelete && (
                     <button
                        type="button"
                        className="btn btn-square btn-ghost btn-sm"
                        onClick={onDelete}
                        aria-label={`Delete ${brick.name}`}
                        title="Delete"
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
                           <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                        </svg>
                     </button>
                  )}
               </div>
            </div>
            <Component input={input} onResult={onResult} />
         </div>
      </div>
   )
}

type CopyStatus = 'idle' | 'copied' | 'failed'

const COPY_ICONS: Record<CopyStatus, string> = {
   idle: 'M9 9h11v11H9zM5 15H4V4h11v1',
   copied: 'M20 6 9 17l-5-5',
   failed: 'M18 6 6 18M6 6l12 12',
}

const CopyButton: React.FC<{ text: string; label: string }> = ({ text, label }) => {
   const [status, setStatus] = useState<CopyStatus>('idle')
   // Show the outcome briefly, then go back to the copy icon
   useEffect(() => {
      if (status === 'idle') {
         return
      }
      const timer = setTimeout(() => setStatus('idle'), 1500)
      return () => clearTimeout(timer)
   }, [status])
   const copy = async () => {
      try {
         await navigator.clipboard.writeText(text)
         setStatus('copied')
      } catch {
         // Clipboard access can be denied, or missing outside a secure context
         setStatus('failed')
      }
   }
   const title = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' }[status]
   return (
      <button
         type="button"
         className={`btn btn-square btn-ghost btn-sm ${status === 'copied' ? 'text-success' : ''} ${
            status === 'failed' ? 'text-error' : ''
         }`}
         onClick={copy}
         disabled={text === ''}
         aria-label={label}
         title={title}
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
            <path d={COPY_ICONS[status]} />
         </svg>
         {/* Announces the outcome to screen readers */}
         <span className="sr-only" aria-live="polite">
            {status === 'idle' ? '' : title}
         </span>
      </button>
   )
}
