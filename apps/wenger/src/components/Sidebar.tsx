export default function Sidebar() {
   return (
      <aside className="border-b border-white/5 bg-white/[0.02] px-4 py-2 md:sticky md:top-14 md:h-[calc(100dvh-3.5rem)] md:w-60 md:shrink-0 md:border-r md:border-b-0 md:py-6">
         <nav aria-label="Main">
            <ul className="flex gap-1 md:flex-col">
               <li>{/*<button className="btn btn-soft btn-accent w-full">Password</button>*/}</li>
            </ul>
         </nav>
      </aside>
   )
}
