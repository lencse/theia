import { createFileRoute } from '@tanstack/react-router'
import { getTmpDir } from '#/serverActions/getTmpDir.ts'

export const Route = createFileRoute('/')({
   component: App,
   loader: async () => {
      return await getTmpDir()
   },
})

function App() {
   const tmp = Route.useLoaderData()
   return (
      <main>
         <h1>Here be dragons</h1>
         <pre>{tmp}</pre>
      </main>
   )
}
