import React from 'react';

export default function NotificationDisplay({ notification, onClose }) {
  const getStyles = () => {
    const baseStyles = 'p-4 rounded-lg shadow-lg border flex items-start gap-3';
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'pending':
        return `${baseStyles} bg-purple-50 border-purple-200 text-purple-800`;
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'pending':
        return '⏳';
      default:
        return '📢';
    }
  };

  return (
    <div className={getStyles()}>
      <span className="text-lg">{getIcon()}</span>
      <div className="flex-1">
        {notification.title && <h3 className="font-semibold">{notification.title}</h3>}
        <p className="text-sm">{notification.message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}
