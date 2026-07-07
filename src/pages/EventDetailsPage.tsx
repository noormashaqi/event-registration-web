import React, { useEffect, useState } from 'react';
import { eventService } from '../api/services/events';
import { Event } from '../types/event';

export const EventDetailsPage: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const pathParts = window.location.pathname.split('/');
  const eventId = Number(pathParts[pathParts.length - 1]);

  useEffect(() => {
    if (!eventId) return;
    eventService.getById(eventId)
      .then(data => setEvent(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [eventId]);

  const goBack = () => {
    window.history.pushState({}, '', '/events');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) return <div className="p-6">جاري تحميل تفاصيل الفعالية...</div>;
  if (!event) return <div className="p-6">الفعالية غير موجودة.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <button onClick={goBack} className="text-blue-600 mb-4 hover:underline">← العودة للنعاليات</button>
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="text-gray-700 mb-6">{event.description || 'لا يوجد وصف متاح.'}</p>
      <div className="border-t pt-4 space-y-2">
        <p><strong>المكان:</strong> {event.location}</p>
        <p><strong>وقت البدء:</strong> {new Date(event.startAt).toLocaleString()}</p>
        <p><strong>السعة الاستيعابية:</strong> {event.capacity} شخص</p>
      </div>
    </div>
  );
};