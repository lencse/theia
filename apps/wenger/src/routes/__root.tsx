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
         {
            name: 'apple-mobile-web-app-title',
            content: 'Wenger',
         },
      ],
      links: [
         {
            rel: 'stylesheet',
            href: appCss,
         },
         {
            rel: 'icon',
            href: '/favicon-96x96.png',
            type: 'image/png',
            sizes: '96x96',
         },
         {
            rel: 'icon',
            href: '/favicon.svg',
            type: 'image/svg+xml',
         },
         {
            rel: 'shortcut icon',
            href: '/favicon.ico',
         },
         {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            sizes: '180x180',
         },
         {
            rel: 'manifest',
            href: '/site.webmanifest',
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
