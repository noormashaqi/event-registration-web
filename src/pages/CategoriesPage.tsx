import { useState } from 'react'

import { categoriesService } from '../api'
import { useApi, useAsyncAction } from '../hooks/useApi'

import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/ui/States'

import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { CategoryForm } from '../components/ui/CategoryForm'

import type {
  Category,
  CategoryFormValues,
} from '../types/category'


export function CategoriesPage() {

  const [includeInactive, setIncludeInactive] = useState(false)

  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useApi(
    () => categoriesService.getAll(includeInactive),
    [includeInactive],
  )


  const [editing, setEditing] =
    useState<Category | null | 'new'>(null)

  const [viewing, setViewing] =
    useState<Category | null>(null)

  const [deleting, setDeleting] =
    useState<Category | null>(null)

  const [deleteError, setDeleteError] =
    useState<string | null>(null)



  const saveAction =
    useAsyncAction(async(values: CategoryFormValues)=>{

      if(editing && editing !== 'new'){
        return categoriesService.update(
          editing.id,
          values
        )
      }

      return categoriesService.create(values)

    })



  const deleteAction =
    useAsyncAction(
      (id:number)=>
        categoriesService.remove(id)
    )


  const toggleAction =
    useAsyncAction((category: Category) =>
      categoriesService.update(category.id, {
        name: category.name,
        description: category.description ?? '',
        isActive: !category.isActive,
      })
    )



  async function handleSave(values: CategoryFormValues){

    try{

      await saveAction.run(values)

      setEditing(null)

      refetch()

    }
    catch{}

  }



  async function handleDelete(){

    if(!deleting)
      return


    try{

      await deleteAction.run(
        deleting.id
      )


      setDeleting(null)

      setDeleteError(null)

      refetch()

    }
    catch(err){

      setDeleteError(
        err instanceof Error
        ? err.message
        : "Unable to delete category."
      )

    }

  }


  async function handleToggleActive(category: Category) {

    try {

      await toggleAction.run(category)

      refetch()

    }
    catch {}

  }



  const total =
    categories?.length ?? 0


  const active =
    categories?.filter(
      c=>c.isActive
    ).length ?? 0


  const inactive =
    total - active



return (

<div className="space-y-6">


{/* Header */}

<div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">


<div>

<h1 className="text-2xl font-bold text-gray-900">
Category Management
</h1>


<p className="mt-1 text-sm text-gray-500">
Manage event categories and organize your events.
</p>

</div>



<Button
onClick={()=>setEditing('new')}
>
+ New Category
</Button>


</div>





{/* Statistics */}

<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


<div className="rounded-2xl bg-white p-5 shadow-sm">

<p className="text-sm text-gray-500">
Total Categories
</p>

<p className="mt-2 text-3xl font-bold text-gray-900">
{total}
</p>

</div>




<div className="rounded-2xl bg-white p-5 shadow-sm">

<p className="text-sm text-gray-500">
Active
</p>

<p className="mt-2 text-3xl font-bold text-green-600">
{active}
</p>

</div>





<div className="rounded-2xl bg-white p-5 shadow-sm">

<p className="text-sm text-gray-500">
Inactive
</p>

<p className="mt-2 text-3xl font-bold text-gray-500">
{inactive}
</p>

</div>



</div>






{/* Filter */}

<div className="rounded-2xl bg-white p-4 shadow-sm">


<label className="flex items-center gap-3 text-sm text-gray-700">


<input

type="checkbox"

className="h-4 w-4 rounded border-gray-300"

checked={includeInactive}

onChange={(e)=>
setIncludeInactive(
e.target.checked
)
}

/>


Show inactive categories


</label>


</div>






{deleteError &&
<ErrorState message={deleteError}/>
}






{loading &&
<LoadingState label="Loading categories..." />
}






{error &&
<ErrorState
message={error}
onRetry={refetch}
/>
}







{
!loading &&
!error &&
categories &&
categories.length===0 &&


<EmptyState

message="No categories available."

action={

<Button
onClick={()=>setEditing('new')}
>
Create Category
</Button>

}

/>

}







{
!loading &&
!error &&
categories &&
categories.length>0 &&


<div className="overflow-hidden rounded-2xl bg-white shadow-sm">


<div className="overflow-x-auto">


<table className="w-full text-left text-sm">


<thead className="bg-gray-50 text-xs uppercase text-gray-500">


<tr>

<th className="px-6 py-4">
Name
</th>


<th className="px-6 py-4">
Description
</th>


<th className="px-6 py-4">
Status
</th>


<th className="px-6 py-4">
Actions
</th>


</tr>


</thead>





<tbody className="divide-y divide-gray-100">


{
categories.map(category=>(


<tr
key={category.id}
className="transition hover:bg-gray-50"
>


<td className="px-6 py-4 font-medium text-gray-900">
{category.name}
</td>



<td className="px-6 py-4 text-gray-600">
{category.description || "-"}
</td>




<td className="px-6 py-4">

<ActiveBadge
isActive={category.isActive}
onToggle={()=>handleToggleActive(category)}
disabled={toggleAction.submitting}
/>

</td>




<td className="px-6 py-4">


<div className="flex gap-2">


<Button
variant="secondary"
onClick={()=>
setViewing(category)
}
>
View
</Button>




<Button
variant="secondary"
onClick={()=>
setEditing(category)
}
>
Edit
</Button>





<Button
variant="danger"
onClick={()=>
setDeleting(category)
}
>
Delete
</Button>


</div>


</td>



</tr>


))

}


</tbody>


</table>


</div>


</div>

}







{/* Create / Edit Modal */}

<Modal

open={editing!==null}

title={
editing==="new"
? "Create Category"
: "Edit Category"
}

onClose={()=>
setEditing(null)
}

>


<CategoryForm

initial={
editing && editing!=="new"
? editing
: null
}

submitting={
saveAction.submitting
}

fieldErrors={
saveAction.fieldErrors
}

onSubmit={handleSave}

onCancel={()=>
setEditing(null)
}

/>


</Modal>






{/* View Modal */}

<Modal

open={viewing!==null}

title="Category Details"

onClose={()=>
setViewing(null)
}

>


<div className="space-y-4 text-sm">


<div>

<p className="text-gray-500">
Name
</p>

<p className="font-medium">
{viewing?.name}
</p>

</div>




<div>

<p className="text-gray-500">
Description
</p>

<p className="font-medium">
{viewing?.description || "-"}
</p>

</div>




<div>

<p className="text-gray-500">
Status
</p>

<ActiveBadge
isActive={
viewing?.isActive ?? false
}
/>

</div>


</div>



</Modal>







<ConfirmDialog

open={deleting!==null}

title="Delete Category"

message={
`Are you sure you want to delete "${deleting?.name}"?`
}

confirmLabel="Delete"

loading={
deleteAction.submitting
}

onConfirm={handleDelete}

onCancel={()=>
setDeleting(null)
}

/>




</div>

)

}