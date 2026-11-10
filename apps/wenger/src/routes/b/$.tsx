import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { type Brick, chainPath, parseChainPath } from '#/bricks/bricks.tsx'
import Canvas from '#/components/Canvas.tsx'
import Sidebar from '#/components/Sidebar.tsx'

// The whole chain lives in the path: /b/<entry brick>/<brick>/<brick>...
export const Route = createFileRoute('/b/$')({
   component: ChainPage,
   // Validate here and parse again in the component: loader data is serialized for SSR,
   // and a brick holds a React component, which can't be
   loader: ({ params }) => {
      if (!parseChainPath(params._splat ?? '')) {
         throw notFound()
      }
   },
})

function ChainPage() {
   const { _splat = '' } = Route.useParams()
   const navigate = useNavigate()
   // Memoized so Canvas gets the same array until the path changes
   const chain = useMemo(() => parseChainPath(_splat), [_splat])
   if (!chain?.[0]) {
      return null
   }
   const changeChain = (next: Brick[]) =>
      navigate({ to: '/b/$', params: { _splat: chainPath(next) } })
   return (
      <div className="md:flex">
         <Sidebar />
         <main className="min-w-0 flex-1">
            {/* Keyed by the entry brick: switching entries starts over, adding bricks doesn't */}
            <Canvas key={chain[0].id} chain={chain} onChainChange={changeChain} />
         </main>
      </div>
   )
}
