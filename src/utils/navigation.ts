/**
 * Lightweight History API routing helpers.
 *
 * The app uses real URLs (via `window.history.pushState`) instead of
 * component-only state, so a page refresh (or a shared link) lands the
 * user back on the page they were viewing instead of always resetting to
 * the dashboard.
 */

export type AppPage = 'dashboard' | 'categories' | 'events' | 'participants'

const PAGES: AppPage[] = ['dashboard', 'categories', 'events', 'participants']

export interface Route {
  page: AppPage
  eventId: number | null
}

function isAppPage(value: string): value is AppPage {
  return (PAGES as string[]).includes(value)
}

/**
 * Parse a URL pathname into a Route. Returns null when the path doesn't
 * match any known route (used to render a 404 page).
 */
export function parsePath(pathname: string): Route | null {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return { page: 'dashboard', eventId: null }
  }

  const [first, second] = segments

  if (!isAppPage(first)) {
    return null
  }

  if (first === 'events' && second !== undefined) {
    if (segments.length !== 2) {
      return null
    }
    const eventId = Number(second)
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return null
    }
    return { page: 'events', eventId }
  }

  if (segments.length !== 1) {
    return null
  }

  return { page: first, eventId: null }
}

/** Build a URL path for a given page (and optional event id). */
export function buildPath(page: AppPage, eventId?: number | null): string {
  if (page === 'events' && eventId != null) {
    return `/events/${eventId}`
  }
  return `/${page}`
}

/** Push a new entry onto the browser history and notify listeners. */
export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path)
  }
  // pushState doesn't fire popstate, so dispatch one ourselves to keep any
  // popstate listeners (including our own) in sync.
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** Read the current route from window.location. */
export function getCurrentRoute(): Route | null {
  return parsePath(window.location.pathname)
}
