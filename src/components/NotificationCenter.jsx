import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationDisplay from './NotificationDisplay';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();
  
  // Separate toast notifications (temporary) from persistent ones
  const toastNotifications = notifications.filter(n => n.type === 'toast');
  const persistentNotifications = notifications.filter(n => n.type !== 'toast');

  return (
    <>
      {/* Toast Notifications - Fixed top right */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-auto">
        {toastNotifications.map(notification => (
          <div key={notification.id} className="animate-slide-in">
            <NotificationDisplay
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>

      {/* Persistent Notifications - Can be added to a sidebar or notification panel */}
      {persistentNotifications.length > 0 && (
        <div className="space-y-2">
          {persistentNotifications.map(notification => (
            <div key={notification.id}>
              <NotificationDisplay
                notification={notification}
                onClose={() => removeNotification(notification.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
