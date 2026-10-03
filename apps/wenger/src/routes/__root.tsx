import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type * as React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
   head: () => ({
      meta: [
         {
            charSet: 'utf-8',
         },
         {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
         },
         {
            title: 'TanStack Start Starter',
         },
      ],
      links: [
         {
            rel: 'stylesheet',
            href: appCss,
         },
      ],
   }),
   shellComponent: RootDocument,
   notFoundComponent: NotFound,
})

function NotFound() {
   return (
      <main>
         <section>
            <p>404</p>
            <h1>Page not found.</h1>
            <p>
               The page you're looking for doesn't exist. <Link to="/">Go back home</Link>.
            </p>
         </section>
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
            <Header />
            {children}
            <Footer />
            <TanStackDevtools
               config={{
                  position: 'bottom-right',
               }}
               plugins={[
                  {
                     name: 'Tanstack Router',
                     render: <TanStackRouterDevtoolsPanel />,
                  },
               ]}
            />
            <Scripts />
         </body>
      </html>
   )
}
