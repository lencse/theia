import { createFileRoute } from '@tanstack/react-router'
import Canvas from '#/components/Canvas.tsx'
import Sidebar from '#/components/Sidebar.tsx'
import { getTmpDir } from '#/serverActions/getTmpDir.ts'

export const Route = createFileRoute('/')({
   component: App,
   loader: async () => {
      return await getTmpDir()
   },
})

function App() {
   return (
      <div className="md:flex">
         <Sidebar />
         <main className="min-w-0 flex-1">
            <Canvas />
         </main>
      </div>
   )
}
