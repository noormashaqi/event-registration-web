import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(fetcher: () => Promise<T>, deps: React.DependencyList): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null })
  const [reloadToken, setReloadToken] = useState(0)

  const refetch = useCallback(() => setReloadToken((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken])

  return { ...state, refetch }
}

export function useAsyncAction<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  const run = useCallback(
    async (...args: Args) => {
      setSubmitting(true)
      setError(null)
      setFieldErrors([])
      try {
        const result = await action(...args)
        setSubmitting(false)
        return result
      } catch (err) {
        setSubmitting(false)
        if (err instanceof ApiError) {
          setError(err.message)
          setFieldErrors(err.errors)
        } else {
          setError('Something went wrong. Please try again.')
        }
        throw err
      }
    },
    [action],
  )

  return { run, submitting, error, fieldErrors, setError }
}