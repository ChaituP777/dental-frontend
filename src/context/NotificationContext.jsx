import React, { createContext, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = React.useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 5 seconds if type is 'toast'
    if (notification.type === 'toast') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
