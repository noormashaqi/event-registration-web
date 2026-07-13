import { useEffect, useState } from 'react'
import { Layout } from './components/layout/Layout'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { EventsPage } from './pages/EventsPage'
import ParticipantsPage from './pages/ParticipantsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { buildPath, getCurrentRoute, navigateTo, type AppPage, type Route } from './utils/navigation'

function App() {
  const [route, setRoute] = useState<Route | null>(() => getCurrentRoute())

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (nextPage: AppPage) => {
    navigateTo(buildPath(nextPage))
    setRoute({ page: nextPage, eventId: null })
  }

  const handleViewEvent = (eventId: number) => {
    navigateTo(buildPath('events', eventId))
    setRoute({ page: 'events', eventId })
  }

  const handleBackToEvents = () => {
    navigateTo(buildPath('events'))
    setRoute({ page: 'events', eventId: null })
  }

  if (route === null) {
    return (
      <Layout currentPage="dashboard" onNavigate={handleNavigate}>
        <NotFoundPage onGoHome={() => handleNavigate('dashboard')} />
      </Layout>
    )
  }

  const renderPage = () => {
    if (route.page === 'events' && route.eventId !== null) {
      return <EventDetailsPage eventId={route.eventId} onBack={handleBackToEvents} />
    }

    switch (route.page) {
      case 'dashboard':
        return <DashboardPage onViewEvent={handleViewEvent} />
      case 'categories':
        return <CategoriesPage />
      case 'events':
        return <EventsPage onViewEvent={handleViewEvent} />
      case 'participants':
        return <ParticipantsPage />
    }
  }

  return (
    <Layout currentPage={route.page} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  )
}

export default App
