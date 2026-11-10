import { createFileRoute } from '@tanstack/react-router'
import type { Brick } from '#/bricks/bricks.tsx'
import { text } from '#/bricks/text/text.tsx'
import Canvas from '#/components/Canvas.tsx'
import Sidebar from '#/components/Sidebar.tsx'

export const Route = createFileRoute('/b/text')({
   component: TextPage,
})

const chain: Brick[] = [text]

function TextPage() {
   return (
      <div className="md:flex">
         <Sidebar />
         <main className="min-w-0 flex-1">
            <Canvas chain={chain} />
         </main>
      </div>
   )
}
