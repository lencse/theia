import type { Brick, BrickProps } from '#/bricks/bricks'

export const TextComponent: React.FC<BrickProps> = ({ onResult }) => {
   return (
      <textarea
         className="textarea font-mono w-full h-72x"
         name="txt"
         id="text-txt"
         onChange={(e) => {
            onResult(e.target.value)
         }}
      ></textarea>
   )
}

export const text: Brick = {
   id: 'text',
   name: 'Text',
   isEntry: true,
   component: TextComponent,
}
