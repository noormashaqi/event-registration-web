import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

export type AppPage = 'dashboard' | 'categories' | 'events'

interface LayoutProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  children: ReactNode
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
