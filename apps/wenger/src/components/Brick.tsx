import type { Brick, BrickProps } from '#/bricks/bricks.tsx'

export type BrickComponentProps = BrickProps & {
   brick: Brick
   // Shows a delete button when given
   onDelete?: () => void
}

export const BrickComponent: React.FC<BrickComponentProps> = ({
   brick,
   input,
   onResult,
   onDelete,
}) => {
   const Component = brick.component
   return (
      <div className="card bg-base-100 w-4xl shadow-sm border border-upset-tomato-900">
         <div className="card-body">
            <div className="mb-4 flex items-center justify-between gap-2">
               <h2 className="card-title">{brick.name}</h2>
               {onDelete && (
                  <button
                     type="button"
                     className="btn btn-square btn-ghost btn-sm"
                     onClick={onDelete}
                     aria-label={`Delete ${brick.name}`}
                     title="Delete"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                        aria-hidden="true"
                     >
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                     </svg>
                  </button>
               )}
            </div>
            <Component input={input} onResult={onResult} />
         </div>
      </div>
   )
}
