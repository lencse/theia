import { describe, expect, test } from 'vitest'
import { type CharSet, charSets as charSetMap, generatePassword } from '../src/password/password'

describe('Password Generator', () => {
   test('default length', () => {
      const result = generatePassword()
      expect(result.length).toEqual(32)
   })

   test('given length', () => {
      const result = generatePassword({ length: 10 })
      expect(result.length).toEqual(10)
   })

   test('each password is unique', () => {
      const result = Array.from({ length: 100 }, () => generatePassword({ length: 10 }))
      expect(new Set(result).size).toEqual(result.length)
   })

   test('default options', () => {
      const result = Array.from(Array(100)).map(() => generatePassword())
      result.forEach((password) => {
         expect(password).toMatch(/^[a-zA-Z0-9]{32}$/)
      })
      const every = result.join('').split('')
      expect(
         every.some((char) => /[a-z]/.test(char)),
         '[a-z]',
      ).toBe(true)
      expect(
         every.some((char) => /[A-Z]/.test(char)),
         '[A-Z]',
      ).toBe(true)
      expect(
         every.some((char) => /[0-9]/.test(char)),
         '[0-9]',
      ).toBe(true)
   })

   test('pattern based on option', () => {
      const testCases: { charSets: CharSet[]; patterns: RegExp[] }[] = [
         { charSets: ['lowerchars'], patterns: [/[a-z]/] },
         {
            charSets: ['lowerchars', 'upperchars'],
            patterns: [/[A-Z]/, /[a-z]/],
         },
         {
            charSets: ['lowerchars', 'upperchars', 'digits'],
            patterns: [/[A-Z]/, /[a-z]/, /[0-9]/],
         },
         {
            charSets: ['lowerchars', 'symbols'],
            patterns: [/[a-z]/, /[!@#$ %()\-+[\].^&*_]/],
         },
         {
            charSets: [],
            patterns: [/[A-Z]/, /[a-z]/, /[0-9]/],
         },
      ]
      testCases.forEach(({ charSets, patterns }) => {
         const result = generatePassword({ length: 1024, charSets })
         const chars = result.split('')
         const wrongChars = chars.filter((char) => !patterns.some((pattern) => pattern.test(char)))
         expect(
            wrongChars,
            `Options [${charSets.join(',')}] generated characters ` +
               `'${[...new Set(wrongChars)].join('')}' not matching ${patterns.join(',')}]`,
         ).toEqual([])
         const missingPatterns = patterns.filter(
            (pattern) => !chars.some((char) => pattern.test(char)),
         )
         expect(missingPatterns, `Options [${charSets.join(',')}] missing patterns`).toEqual([])
      })
   })

   test('every password contains at least one char from each selected charset', () => {
      const testCases: CharSet[][] = [
         ['lowerchars', 'upperchars'],
         ['lowerchars', 'upperchars', 'digits'],
         ['lowerchars', 'upperchars', 'digits', 'symbols'],
      ]
      for (const selectedCharSets of testCases) {
         const passwords = Array.from({ length: 100 }, () =>
            generatePassword({ length: selectedCharSets.length, charSets: selectedCharSets }),
         )
         for (const password of passwords) {
            for (const cs of selectedCharSets) {
               const allowed = charSetMap[cs]
               expect(
                  [...password].some((c) => allowed.includes(c)),
                  `password "${password}" missing chars from charset "${cs}"`,
               ).toBe(true)
            }
         }
      }
   })
})
