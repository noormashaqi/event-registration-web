import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

function FieldWrapper({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

const inputBaseClasses =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function TextField({ label, id, required, error, className = '', ...rest }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id ?? label} required={required} error={error}>
      <input id={id ?? label} className={`${inputBaseClasses} ${className}`} {...rest} />
    </FieldWrapper>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextAreaField({ label, id, required, error, className = '', ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id ?? label} required={required} error={error}>
      <textarea id={id ?? label} rows={3} className={`${inputBaseClasses} ${className}`} {...rest} />
    </FieldWrapper>
  )
}

export function CheckboxField({ label, id, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <input id={id ?? label} type="checkbox" className="h-4 w-4 rounded border-gray-300" {...rest} />
      <label htmlFor={id ?? label} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  )
}