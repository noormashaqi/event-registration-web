import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { EventDetail, EventFormValues, EventSummary } from '../../types/event'
import { Button } from '../ui/Button'
import { CheckboxField, SelectField, TextAreaField, TextField } from '../ui/FormFields'
import { fromDateTimeLocalInput, toDateTimeLocalInput } from '../../utils/formatters'

interface EventFormProps {
  initial?: EventSummary | EventDetail | null
  categories: Category[]
  submitting: boolean
  fieldErrors: string[]
  onSubmit: (values: EventFormValues) => void
  onCancel: () => void
}

interface FormState {
  categoryId: string
  name: string
  description: string
  location: string
  startAt: string
  endAt: string
  registrationDeadline: string
  capacity: string
  isActive: boolean
}

function toFormState(initial?: EventSummary | EventDetail | null): FormState {
  return {
    categoryId: initial ? String(initial.categoryId) : '',
    name: initial?.name ?? '',
    description: (initial as EventDetail | undefined)?.description ?? '',
    location: initial?.location ?? '',
    startAt: toDateTimeLocalInput(initial?.startAt),
    endAt: toDateTimeLocalInput(initial?.endAt),
    registrationDeadline: toDateTimeLocalInput(initial?.registrationDeadline),
    capacity: initial ? String(initial.capacity) : '',
    isActive: initial?.isActive ?? true,
  }
}

export function EventForm({ initial, categories, submitting, fieldErrors, onSubmit, onCancel }: EventFormProps) {
  const [values, setValues] = useState<FormState>(() => toFormState(initial))
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const trimmedName = values.name.trim()
    const trimmedLocation = values.location.trim()
    const trimmedDescription = values.description.trim()
    const capacityNum = Number(values.capacity)

    const validationErrors: string[] = []

    if (!values.categoryId) validationErrors.push('Category is required.')
    if (!trimmedName) validationErrors.push('Name is required.')
    else if (trimmedName.length > 150) validationErrors.push('Name must not exceed 150 characters.')
    if (!trimmedLocation) validationErrors.push('Location is required.')
    else if (trimmedLocation.length > 200) validationErrors.push('Location must not exceed 200 characters.')
    if (trimmedDescription.length > 1000) validationErrors.push('Description must not exceed 1000 characters.')
    if (!values.startAt) validationErrors.push('Start date/time is required.')
    if (!values.endAt) validationErrors.push('End date/time is required.')
    if (!values.registrationDeadline) validationErrors.push('Registration deadline is required.')
    if (!Number.isFinite(capacityNum) || capacityNum < 1 || capacityNum > 10000) {
      validationErrors.push('Capacity must be between 1 and 10000.')
    }

    if (values.startAt && values.endAt && new Date(values.endAt) <= new Date(values.startAt)) {
      validationErrors.push('End must be later than start.')
    }
    if (values.startAt && values.registrationDeadline && new Date(values.registrationDeadline) > new Date(values.startAt)) {
      validationErrors.push('Registration deadline must not be later than the start time.')
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])

    onSubmit({
      categoryId: Number(values.categoryId),
      name: trimmedName,
      description: trimmedDescription,
      location: trimmedLocation,
      startAt: fromDateTimeLocalInput(values.startAt),
      endAt: fromDateTimeLocalInput(values.endAt),
      registrationDeadline: fromDateTimeLocalInput(values.registrationDeadline),
      capacity: capacityNum,
      isActive: values.isActive,
    })
  }

  const allErrors = [...errors, ...fieldErrors]

  // Make sure the event's current category still shows up in the dropdown
  // even if it has since been deactivated (and so is excluded from the
  // "active categories" list passed in by the parent).
  const categoryOptions =
    initial && !categories.some((c) => c.id === initial.categoryId)
      ? [...categories, { id: initial.categoryId, name: initial.categoryName, description: null, isActive: false, createdAt: '', updatedAt: null }]
      : categories

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        label="Category"
        required
        value={values.categoryId}
        onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}
      >
        <option value="">Select a category…</option>
        {categoryOptions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </SelectField>

      <TextField
        label="Name"
        required
        maxLength={150}
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
      />

      <TextAreaField
        label="Description"
        maxLength={1000}
        value={values.description}
        onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
      />

      <TextField
        label="Location"
        required
        maxLength={200}
        value={values.location}
        onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
      />

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <TextField
          label="Start"
          type="datetime-local"
          required
          value={values.startAt}
          onChange={(e) => setValues((v) => ({ ...v, startAt: e.target.value }))}
        />
        <TextField
          label="End"
          type="datetime-local"
          required
          value={values.endAt}
          onChange={(e) => setValues((v) => ({ ...v, endAt: e.target.value }))}
        />
      </div>

      <TextField
        label="Registration deadline"
        type="datetime-local"
        required
        value={values.registrationDeadline}
        onChange={(e) => setValues((v) => ({ ...v, registrationDeadline: e.target.value }))}
      />

      <TextField
        label="Capacity"
        type="number"
        required
        min={1}
        max={10000}
        value={values.capacity}
        onChange={(e) => setValues((v) => ({ ...v, capacity: e.target.value }))}
      />

      <CheckboxField
        label="Active"
        checked={values.isActive}
        onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
      />

      {allErrors.length > 0 && (
        <ul className="mb-4 list-inside list-disc rounded-md bg-red-50 p-3 text-sm text-red-700">
          {allErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </form>
  )
}
