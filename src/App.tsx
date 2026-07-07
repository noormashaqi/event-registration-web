import { useState } from 'react'
import { Layout, type AppPage } from './components/layout/Layout'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { EventsPage } from './pages/EventsPage'

function App() {
  const [page, setPage] = useState<AppPage>('dashboard')
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const handleNavigate = (nextPage: AppPage) => {
    setPage(nextPage)
    setSelectedEventId(null)
  }

  const handleViewEvent = (eventId: number) => {
    setPage('events')
    setSelectedEventId(eventId)
  }

  const handleBackToEvents = () => {
    setSelectedEventId(null)
  }

  const renderPage = () => {
    if (selectedEventId !== null) {
      return <EventDetailsPage eventId={selectedEventId} onBack={handleBackToEvents} />
    }

    switch (page) {
      case 'dashboard':
        return <DashboardPage />
      case 'categories':
        return <CategoriesPage />
      case 'events':
        return <EventsPage onViewEvent={handleViewEvent} />
    }
  }

  return (
    <Layout currentPage={page} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  )
}

export default App
