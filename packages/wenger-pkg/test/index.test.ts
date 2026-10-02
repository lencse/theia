import { describe, expect, it } from 'vitest'
import { charSets, generatePassword } from '../src/index'

describe('package entry', () => {
   it('exposes the password generator', () => {
      expect(generatePassword({ length: 8 })).toHaveLength(8)
      expect(Object.keys(charSets)).toEqual(['lowerchars', 'upperchars', 'digits', 'symbols'])
   })
})
