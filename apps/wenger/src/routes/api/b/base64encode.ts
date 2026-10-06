import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/b/base64encode')({
   server: {
      handlers: {
         GET: async ({ request }) => {
            const url = new URL(request.url)
            const input = url.searchParams.get('input')
            if (input === null) {
               return new Response(
                  JSON.stringify({ error: 'Missing required query parameter: input' }),
                  {
                     status: 400,
                     headers: {
                        'Content-Type': 'application/json',
                     },
                  },
               )
            }

            return new Response(
               JSON.stringify({
                  result: btoa(input),
               }),
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               },
            )
         },
      },
   },
})
