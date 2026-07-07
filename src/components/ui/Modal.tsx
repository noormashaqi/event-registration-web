import type { ReactNode } from 'react'


interface ModalProps {

open:boolean

title:string

onClose:()=>void

children:ReactNode

}



export function Modal({
open,
title,
onClose,
children
}:ModalProps){


if(!open)
return null



return (

<div className="
fixed
inset-0
z-40
flex
items-center
justify-center
bg-black/40
p-4
">


<div className="
w-full
max-w-xl
rounded-2xl
bg-white
p-6
shadow-xl
">


<div className="
mb-6
flex
items-center
justify-between
">


<h2 className="
text-lg
font-semibold
text-gray-900
">

{title}

</h2>



<button

onClick={onClose}

className="
text-gray-400
hover:text-gray-700
text-xl
"

>

✕

</button>


</div>



{children}



</div>


</div>


)

}