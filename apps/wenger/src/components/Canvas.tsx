import { useState } from 'react'
import { Base64EncodeComponent } from '#/bricks/text/base64encode.tsx'
import { PasswordComponent } from '#/bricks/text/password.tsx'

export default function Canvas() {
   const [txt, setTxt] = useState('')
   return (
      <section className="p-6">
         <div className="card bg-base-100 w-6xl shadow-sm  border border-upset-tomato-900">
            <div className="card-body">
               <h2 className="card-title mb-4 ">Text</h2>
               <PasswordComponent
                  input=""
                  onResult={(result) => {
                     setTxt(result)
                  }}
               />
            </div>
         </div>
         <div className="card bg-base-100 w-6xl shadow-sm  border border-upset-tomato-900">
            <div className="card-body">
               <h2 className="card-title mb-4 ">Text</h2>
               <Base64EncodeComponent input={txt} onResult={() => {}} />
            </div>
         </div>
      </section>
   )
}
