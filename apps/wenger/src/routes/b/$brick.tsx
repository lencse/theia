import { createFileRoute, notFound } from '@tanstack/react-router'
import { useMemo } from 'react'
import { brickTypes } from '#/bricks/bricks.tsx'
import Canvas from '#/components/Canvas.tsx'
import Sidebar from '#/components/Sidebar.tsx'

// Only entry bricks can start a chain, so only they get a page
const findEntryBrick = (id: string) => brickTypes.find((b) => b.isEntry && b.id === id)

export const Route = createFileRoute('/b/$brick')({
   component: BrickPage,
   // Validate here and look the brick up again in the component: loader data is
   // serialized for SSR, and a brick holds a React component, which can't be
   loader: ({ params }) => {
      if (!findEntryBrick(params.brick)) {
         throw notFound()
      }
   },
})

function BrickPage() {
   const { brick: brickId } = Route.useParams()
   const brick = findEntryBrick(brickId)
   // Canvas needs a stable chain array (see its props)
   const chain = useMemo(() => (brick ? [brick] : []), [brick])
   return (
      <div className="md:flex">
         <Sidebar />
         <main className="min-w-0 flex-1">
            {/* Keyed so Canvas state resets when navigating between bricks */}
            <Canvas key={brickId} chain={chain} />
         </main>
      </div>
   )
}
