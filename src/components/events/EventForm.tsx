import { useState, type FormEvent, type ChangeEvent } from 'react'
import type { Category } from '../../types/category'
import type { EventDetails, EventFormValues } from '../../types/event'
import { Button } from '../ui/Button'
import { CheckboxField, SelectField, TextAreaField, TextField } from '../ui/FormFields'
import { isoUtcToLocalDateTimeInput, localDateTimeToIsoUtc } from '../../utils/formatters'

interface EventFormProps {
  categories: Category[]
  initial?: EventDetails | null
  submitting: boolean
  fieldErrors: string[]
  onSubmit: (values: EventFormValues) => void
  onCancel: () => void
}

export function EventForm({ categories, initial, submitting, fieldErrors, onSubmit, onCancel }: EventFormProps) {
  const [values, setValues] = useState({
    categoryId: initial?.categoryId ?? categories[0]?.id ?? 0,
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    location: initial?.location ?? '',
    startAt: initial ? isoUtcToLocalDateTimeInput(initial.startAt) : '',
    endAt: initial ? isoUtcToLocalDateTimeInput(initial.endAt) : '',
    registrationDeadline: initial?.registrationDeadline ? isoUtcToLocalDateTimeInput(initial.registrationDeadline) : '',
    capacity: initial?.capacity ?? 10,
    isActive: initial?.isActive ?? true,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload: EventFormValues = {
      ...values,
      startAt: localDateTimeToIsoUtc(values.startAt),
      endAt: localDateTimeToIsoUtc(values.endAt),
      registrationDeadline: localDateTimeToIsoUtc(values.registrationDeadline),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <SelectField
        label="Category"
        required
        value={values.categoryId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setValues((v) => ({ ...v, categoryId: Number(e.target.value) }))}
      >
        {categories.map((c) => (
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

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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
        label="Registration Deadline"
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
        onChange={(e) => setValues((v) => ({ ...v, capacity: Number(e.target.value) }))}
      />

      {initial && (
        <CheckboxField
          label="Active"
          checked={values.isActive}
          onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
        />
      )}

      {fieldErrors.length > 0 && (
        <ul className="mb-4 list-inside list-disc rounded-md bg-red-50 p-3 text-sm text-red-700">
          {fieldErrors.map((err) => (
            <li key={err}>{err}</li>
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
