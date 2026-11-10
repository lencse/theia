import { useEffect, useRef, useState } from 'react'
import { type Brick, brickTypes } from '#/bricks/bricks.tsx'
import { BrickComponent } from '#/components/Brick.tsx'

// Entry bricks only start a chain; the rest can be appended to one
const addableBricks = brickTypes.filter((b) => !b.isEntry)

type CanvasProps = {
   // Only read on mount; key the Canvas to start over with a different chain
   initialChain: Brick[]
}

// The same brick type can appear more than once, so each placed brick gets its own key
type ChainItem = { key: number; brick: Brick }

export default function Canvas({ initialChain }: CanvasProps) {
   const nextKey = useRef(initialChain.length)
   const [chain, setChain] = useState<ChainItem[]>(() =>
      initialChain.map((brick, key) => ({ key, brick })),
   )
   // Each brick's result becomes the next brick's input. Results are kept for every brick,
   // including the last, so a newly added brick starts from the current output.
   const [results, setResults] = useState<string[]>([])
   // One handler per position, created once so its identity never changes; bricks that
   // list onResult in an effect's dependencies would otherwise re-run on every render
   const handlers = useRef<((result: string) => void)[]>([])
   const handlerFor = (idx: number) => {
      handlers.current[idx] ??= (result: string) =>
         setResults((prev) => {
            if (prev[idx] === result) {
               return prev
            }
            const next = [...prev]
            next[idx] = result
            return next
         })
      return handlers.current[idx]
   }
   const [menuOpen, setMenuOpen] = useState(false)
   const menuRef = useRef<HTMLDivElement>(null)
   // Close on a click outside or Escape. State instead of daisyUI's focus-based dropdown:
   // Safari doesn't focus a button on click, so that one never opens there.
   useEffect(() => {
      if (!menuOpen) {
         return
      }
      const onPointerDown = (e: PointerEvent) => {
         if (!menuRef.current?.contains(e.target as Node)) {
            setMenuOpen(false)
         }
      }
      const onKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            setMenuOpen(false)
         }
      }
      document.addEventListener('pointerdown', onPointerDown)
      document.addEventListener('keydown', onKeyDown)
      return () => {
         document.removeEventListener('pointerdown', onPointerDown)
         document.removeEventListener('keydown', onKeyDown)
      }
   }, [menuOpen])
   const addBrick = (brick: Brick) => {
      setChain((prev) => [...prev, { key: nextKey.current++, brick }])
      setMenuOpen(false)
   }
   return (
      <section className="flex flex-col gap-4 p-6">
         {chain.map(({ key, brick }, idx) => (
            <BrickComponent
               key={key}
               brick={brick}
               input={idx === 0 ? '' : (results[idx - 1] ?? '')}
               onResult={handlerFor(idx)}
            />
         ))}
         {/* Same width as a brick card so the button sits centered under it */}
         <div className="flex w-4xl justify-center">
            <div ref={menuRef} className="relative">
               <button
                  type="button"
                  className="btn btn-circle btn-primary"
                  aria-label="Add brick"
                  title="Add brick"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     className="size-5"
                     aria-hidden="true"
                  >
                     <path d="M12 5v14M5 12h14" />
                  </svg>
               </button>
               {menuOpen && (
                  <ul className="menu absolute top-full left-1/2 z-10 mt-2 w-52 -translate-x-1/2 rounded-box bg-base-200 p-2 shadow-sm">
                     {addableBricks.map((brick) => (
                        <li key={brick.id}>
                           <button type="button" onClick={() => addBrick(brick)}>
                              {brick.name}
                           </button>
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>
      </section>
   )
}
