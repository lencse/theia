import { Link } from '@tanstack/react-router'

export default function Header() {
   return (
      <header className="sticky top-0 z-10 flex h-14 items-center border-b border-white/5 bg-canvas/80 px-4 backdrop-blur">
         <Link
            to="/"
            className="flex items-center gap-2.5 rounded-md px-2 py-1 font-semibold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-upset-tomato-400"
         >
            <img src="/favicon.svg" alt="" className="size-7" />
            Wenger
         </Link>
      </header>
   )
}
