import React, { useState, useEffect } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '/dashboard') {
      return <DashboardPage />;
    }
    if (currentPath === '/categories') {
      return <CategoriesPage />;
    }
    if (currentPath === '/events') {
      return <EventsPage />;
    }
    if (currentPath.startsWith('/events/')) {
      return <EventDetailsPage />;
    }
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* هنا يمكنكِ وضع الـ Navbar المشترك لاحقاً إن وجد */}
      <main>{renderPage()}</main>
    </div>
  );
};

export default App;