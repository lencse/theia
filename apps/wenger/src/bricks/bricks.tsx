import { base64decode } from '#/bricks/text/base64decode.tsx'
import { base64encode } from '#/bricks/text/base64encode.tsx'
import { password } from '#/bricks/text/password.tsx'
import { text } from '#/bricks/text/text.tsx'

export type BrickProps = {
   input: string
   onResult: (result: string) => void
}

export type Brick = {
   id: string
   name: string
   isEntry: boolean
   component: React.ComponentType<BrickProps>
}

export const brickTypes = [text, password, base64encode, base64decode]

// Entry bricks start a chain; the rest can only follow one
export const entryBricks = brickTypes.filter((b) => b.isEntry)
export const addableBricks = brickTypes.filter((b) => !b.isEntry)

// A chain's URL path is its brick ids in order, e.g. text/base64encode/base64decode
export const chainPath = (chain: Brick[]) => chain.map((b) => b.id).join('/')

// Returns undefined unless the path is one entry brick followed by non-entry bricks
export const parseChainPath = (path: string): Brick[] | undefined => {
   const [entryId, ...restIds] = path.split('/').filter(Boolean)
   const entry = entryBricks.find((b) => b.id === entryId)
   if (!entry) {
      return undefined
   }
   const chain: Brick[] = [entry]
   for (const id of restIds) {
      const brick = addableBricks.find((b) => b.id === id)
      if (!brick) {
         return undefined
      }
      chain.push(brick)
   }
   return chain
}
