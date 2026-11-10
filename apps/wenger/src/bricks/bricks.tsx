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

// Entry bricks start a chain and each gets its own page at /b/$brick
export const entryBricks = brickTypes.filter((b) => b.isEntry)
