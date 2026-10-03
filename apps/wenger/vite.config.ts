import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const config = defineConfig({
   resolve: { tsconfigPaths: true },
   plugins: [
      // Vite already forwards browser errors to the terminal. With TanStack also piping
      // terminal logs to the browser, a single error echoes back and forth forever.
      devtools({ consolePiping: { enabled: false } }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      // The app has no edge functions. Netlify's emulator passes `--allow-scripts` to
      // `deno eval`, which Deno >= 2.9 rejects, crashing the dev server.
      netlify({ dev: { edgeFunctions: { enabled: false } } }),
   ],
})

export default config
