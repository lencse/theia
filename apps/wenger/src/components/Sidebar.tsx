import { Link } from '@tanstack/react-router'

const navItems = [
   { to: '/', label: 'Home' },
   { to: '/about', label: 'About' },
] as const

export default function Sidebar() {
   return (
      <aside className="border-b border-white/5 bg-white/[0.02] px-4 py-2 md:sticky md:top-14 md:h-[calc(100dvh-3.5rem)] md:w-60 md:shrink-0 md:border-r md:border-b-0 md:py-6">
         <nav aria-label="Main">
            <ul className="flex gap-1 md:flex-col">
               {navItems.map((item) => (
                  <li key={item.to}>
                     <Link
                        to={item.to}
                        activeOptions={{ exact: true }}
                        className="relative block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-upset-tomato-400"
                        activeProps={{
                           className:
                              'bg-white/5 text-white before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-upset-tomato-500',
                        }}
                        inactiveProps={{
                           className: 'text-ink/60 hover:bg-white/5 hover:text-ink',
                        }}
                     >
                        {item.label}
                     </Link>
                  </li>
               ))}
            </ul>
         </nav>
      </aside>
   )
}
