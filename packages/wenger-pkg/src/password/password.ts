import { getRandomBytes, getRandomSampledString } from 'js-crypto-random'

export const charSets = {
   lowerchars: 'abcdefghijklmnopqrstuvwxyz',
   upperchars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
   digits: '0123456789',
   symbols: '!@#$%^&*()-+ [].',
}

export type CharSet = keyof typeof charSets

export type PasswordOptions = {
   length: number
   charSets: CharSet[]
}

const defaultOptions: PasswordOptions = {
   length: 32,
   charSets: ['digits', 'lowerchars', 'upperchars'],
}

export const generatePassword = (options: Partial<PasswordOptions> = {}) => {
   const opts = { ...defaultOptions, ...options }
   if (opts.charSets.length === 0) {
      opts.charSets = defaultOptions.charSets
   }
   const chars = opts.charSets.map((charSet) => charSets[charSet]).join('')

   // One guaranteed character per charset, remainder from the combined pool
   const guaranteed = opts.charSets.map((cs) => getRandomSampledString(1, charSets[cs]))
   const remaining = Math.max(0, opts.length - guaranteed.length)
   const rest = remaining > 0 ? getRandomSampledString(remaining, chars).split('') : []

   // Fisher-Yates shuffle with cryptographically random bytes
   const combined = [...guaranteed, ...rest]
   const randomBytes = getRandomBytes(combined.length)
   for (let i = combined.length - 1; i > 0; i--) {
      // Indices are in bounds by construction; the casts satisfy noUncheckedIndexedAccess
      const j = (randomBytes[i] as number) % (i + 1)
      const tmp = combined[i] as string
      combined[i] = combined[j] as string
      combined[j] = tmp
   }

   return combined.join('')
}
