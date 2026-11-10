import type { Brick, BrickProps } from '#/bricks/bricks.tsx'

export type BrickComponentProps = BrickProps & {
   brick: Brick
}

export const BrickComponent: React.FC<BrickComponentProps> = ({ brick, input, onResult }) => {
   const Component = brick.component
   return (
      <div className="card bg-base-100 w-4xl shadow-sm border border-upset-tomato-900">
         <div className="card-body">
            <h2 className="card-title mb-4">{brick.name}</h2>
            <Component input={input} onResult={onResult} />
         </div>
      </div>
   )
}
