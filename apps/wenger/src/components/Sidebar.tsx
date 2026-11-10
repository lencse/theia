import { Link } from '@tanstack/react-router'
import { entryBricks } from '#/bricks/bricks.tsx'

export default function Sidebar() {
   return (
      <aside className="border-b border-white/5 bg-white/[0.02] px-4 py-2 md:sticky md:top-14 md:h-[calc(100dvh-3.5rem)] md:w-60 md:shrink-0 md:border-r md:border-b-0 md:py-6">
         <nav aria-label="Main">
            <ul className="flex gap-1 md:flex-col">
               {entryBricks.map((brick) => (
                  <li key={brick.id}>
                     <Link
                        to="/b/$brick"
                        params={{ brick: brick.id }}
                        className="btn btn-sm w-full justify-start"
                        activeProps={{ className: 'btn-soft btn-accent' }}
                        inactiveProps={{ className: 'btn-ghost' }}
                     >
                        {brick.name}
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
      </aside>
   )
}
