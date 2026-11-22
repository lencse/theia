import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type * as React from 'react'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
   head: () => ({
      meta: [
         { charSet: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1' },
         { title: 'aworld' },
      ],
      links: [{ rel: 'stylesheet', href: appCss }],
   }),
   shellComponent: RootDocument,
   notFoundComponent: NotFound,
})

function NotFound() {
   return (
      <main className="p-8">
         <h1 className="text-2xl font-bold">Page not found.</h1>
         <p>
            <Link to="/" className="link">
               Go back home
            </Link>
         </p>
      </main>
   )
}

function RootDocument({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <HeadContent />
         </head>
         <body className="font-sans antialiased">
            {children}
            <TanStackDevtools
               config={{ position: 'bottom-right' }}
               plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
            />
            <Scripts />
         </body>
      </html>
   )
}
