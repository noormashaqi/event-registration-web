import { useState } from 'react'
import { Layout } from './components/layout/Layout'
import { CategoriesPage } from './pages/CategoriesPage'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  const [page, setPage] = useState<'dashboard' | 'categories'>('dashboard')

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === 'dashboard' ? <DashboardPage /> : <CategoriesPage />}
    </Layout>
  )
}

export default App