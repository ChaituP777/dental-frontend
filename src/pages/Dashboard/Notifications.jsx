import React, { useEffect, useState } from "react";
import api from "../../lib/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("unread");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  async function markAllAsRead() {
    try {
      await api.put("/notifications/read/all");
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  }

  async function deleteNotification(id) {
    try {
      await api.delete(`/notifications/${id}`);
      loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  }

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "pending":
        return "⏳";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">🔔 Notifications</h2>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1 rounded-md text-sm transition ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm transition ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-base sm:text-lg">
            {filter === "unread" ? "No unread notifications" : "No notifications"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border transition ${getColor(notif.type)} ${
                !notif.is_read ? "shadow-md ring-1 ring-opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{getIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base">{notif.title}</h3>
                  <p className="text-sm mt-1">{notif.message}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
