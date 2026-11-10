import { createFileRoute } from '@tanstack/react-router'
import type { Brick } from '#/bricks/bricks.tsx'
import { password } from '#/bricks/text/password.tsx'
import Canvas from '#/components/Canvas.tsx'
import Sidebar from '#/components/Sidebar.tsx'

export const Route = createFileRoute('/b/password')({
   component: PasswordPage,
})

const chain: Brick[] = [password]

function PasswordPage() {
   return (
      <div className="md:flex">
         <Sidebar />
         <main className="min-w-0 flex-1">
            <Canvas chain={chain} />
         </main>
      </div>
   )
}
