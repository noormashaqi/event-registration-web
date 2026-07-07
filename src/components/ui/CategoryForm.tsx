import { useState, type FormEvent } from 'react'
import type { Category, CategoryFormValues } from '../../types/category'
import { Button } from './Button'
import { CheckboxField, TextAreaField, TextField } from './FormFields'

interface CategoryFormProps {
  initial?: Category | null
  submitting: boolean
  fieldErrors: string[]
  onSubmit: (values: CategoryFormValues) => void
  onCancel: () => void
}

export function CategoryForm({
  initial,
  submitting,
  fieldErrors,
  onSubmit,
  onCancel,
}: CategoryFormProps) {

  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    isActive: initial?.isActive ?? true,
  })

  const [errors, setErrors] = useState<string[]>([])


  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validationErrors: string[] = []

    const trimmedName = values.name.trim()
    const trimmedDescription = values.description.trim()


    // Name required
    if (!trimmedName) {
      validationErrors.push('Name is required.')
    }


    // Name length
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      validationErrors.push(
        'Name must be between 2 and 100 characters.'
      )
    }


    // Description length
    if (trimmedDescription.length > 500) {
      validationErrors.push(
        'Description must not exceed 500 characters.'
      )
    }


    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }


    setErrors([])


    onSubmit({
      name: trimmedName,
      description: trimmedDescription,
      isActive: values.isActive,
    })
  }


  const allErrors = [
    ...errors,
    ...fieldErrors,
  ]


  return (
    <form onSubmit={handleSubmit}>

      <TextField
        label="Name"
        required
        maxLength={100}
        value={values.name}
        onChange={(e) =>
          setValues((v) => ({
            ...v,
            name: e.target.value,
          }))
        }
      />


      <TextAreaField
        label="Description"
        maxLength={500}
        value={values.description}
        onChange={(e) =>
          setValues((v) => ({
            ...v,
            description: e.target.value,
          }))
        }
      />


      {initial && (
        <CheckboxField
          label="Active"
          checked={values.isActive}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              isActive: e.target.checked,
            }))
          }
        />
      )}



      {allErrors.length > 0 && (
        <ul className="mb-4 list-inside list-disc rounded-md bg-red-50 p-3 text-sm text-red-700">

          {allErrors.map((error) => (
            <li key={error}>
              {error}
            </li>
          ))}

        </ul>
      )}



      <div className="flex justify-end gap-2">

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>


        <Button
          type="submit"
          loading={submitting}
        >
          {initial ? 'Save Changes' : 'Create Category'}
        </Button>

      </div>


    </form>
  )
}