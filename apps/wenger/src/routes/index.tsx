import { tmpdir } from 'node:os'
import { createFileRoute } from '@tanstack/react-router'
import { getTmpDir } from '#/serverActions/getTmpDir.ts'

export const Route = createFileRoute('/')({
   component: App,
   loader: async () => {
      const tmp = await getTmpDir()
      return `fn: ${tmpdir()}\nhtttp: ${tmp}`
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
