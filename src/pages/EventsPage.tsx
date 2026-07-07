import React, { useEffect, useState } from 'react';
import { eventService } from '../api/services/events';
import { Event } from '../types/event';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll()
      .then(data => setEvents(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const navigateToDetails = (id: number) => {

    window.history.pushState({}, '', `/events/${id}`);
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  if (loading) return <div className="p-6">جاري تحميل الفعاليات...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">قائمة الفعاليات المتاحة</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event.id} className="border p-4 rounded shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-600 mb-2">{event.location}</p>
            <p className="text-sm text-gray-500 mb-4">التاريخ: {new Date(event.startAt).toLocaleDateString()}</p>
            <button 
              onClick={() => navigateToDetails(event.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              عرض التفاصيل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};