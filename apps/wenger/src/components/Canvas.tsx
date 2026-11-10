import { useMemo, useState } from 'react'
import type { Brick } from '#/bricks/bricks.tsx'
import { base64decode } from '#/bricks/text/base64decode.tsx'
import { base64encode } from '#/bricks/text/base64encode.tsx'
import { text } from '#/bricks/text/text.tsx'
import { BrickComponent } from '#/components/Brick.tsx'

// Each brick's result becomes the next brick's input
const defaultChain: Brick[] = [text, base64encode, base64decode]

type CanvasProps = {
   // Pass a stable (module-level) array: a new array each render resets the handlers
   chain?: Brick[]
}

export default function Canvas({ chain = defaultChain }: CanvasProps) {
   // One state array instead of useState per brick: hooks can't be called inside a loop
   const [inputs, setInputs] = useState<string[]>(() => chain.map(() => ''))
   // Created once so the handlers keep the same identity across renders; bricks that
   // list onResult in an effect's dependencies would otherwise re-run on every render
   const onResults = useMemo(
      () =>
         chain.map((_, idx) => (result: string) => {
            if (idx === chain.length - 1) {
               return
            }
            setInputs((prev) =>
               prev[idx + 1] === result
                  ? prev
                  : prev.map((value, i) => (i === idx + 1 ? result : value)),
            )
         }),
      [chain],
   )
   return (
      <section className="flex flex-col gap-4 p-6">
         {chain.map((brick, idx) => (
            <BrickComponent
               key={brick.id}
               brick={brick}
               input={inputs[idx] ?? ''}
               onResult={onResults[idx] ?? (() => {})}
            />
         ))}
      </section>
   )
}
