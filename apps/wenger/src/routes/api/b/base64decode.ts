import { createFileRoute } from '@tanstack/react-router'

// Standard base64 alphabet with optional padding. Buffer.from(…, 'base64') silently skips
// characters outside the alphabet, so invalid input has to be rejected up front.
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

const json = (body: unknown, status = 200) =>
   new Response(JSON.stringify(body), {
      status,
      headers: {
         'Content-Type': 'application/json',
      },
   })

export const Route = createFileRoute('/api/b/base64decode')({
   server: {
      handlers: {
         GET: async ({ request }) => {
            const url = new URL(request.url)
            const input = url.searchParams.get('input')
            if (input === null) {
               return json({ error: 'Missing required query parameter: input' }, 400)
            }
            // Whitespace is allowed so pasted, line-wrapped base64 still decodes
            const normalized = input.replace(/\s/g, '')
            if (!BASE64_PATTERN.test(normalized) || normalized.length % 4 === 1) {
               return json({ error: 'Input is not valid base64' }, 400)
            }
            let result: string
            try {
               result = new TextDecoder('utf-8', { fatal: true }).decode(
                  Buffer.from(normalized, 'base64'),
               )
            } catch {
               return json({ error: 'Decoded data is not valid UTF-8 text' }, 400)
            }
            return json({ result })
         },
      },
   },
})
