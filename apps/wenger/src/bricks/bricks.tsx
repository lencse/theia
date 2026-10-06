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

export const brickTypes = [text]
