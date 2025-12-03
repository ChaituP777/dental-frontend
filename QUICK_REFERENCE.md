# Notification Feature - Quick Reference

## Files Created/Modified

### NEW FILES (Frontend)
- ✨ `src/context/NotificationContext.jsx` - Global notification state
- ✨ `src/components/NotificationCenter.jsx` - Notification display container
- ✨ `src/components/NotificationDisplay.jsx` - Individual notification UI
- ✨ `src/pages/Dashboard/Notifications.jsx` - User notification page
- ✨ `src/lib/notificationApi.js` - Notification API utilities

### NEW FILES (Backend)
- ✨ `backend/src/routes/notifications.js` - Notification API endpoints

### MODIFIED FILES (Frontend)
- 📝 `src/App.jsx` - Added NotificationProvider wrapper
- 📝 `src/index.css` - Added slide-in animation
- 📝 `src/pages/Dashboard/index.jsx` - Added notifications route + unread badge
- 📝 `src/pages/AdminDashboard.jsx` - Added pending notification alert

### MODIFIED FILES (Backend)
- 📝 `backend/src/index.js` - Registered notification routes
- 📝 `backend/src/routes/appointments.js` - Added admin notification on booking
- 📝 `backend/src/routes/admin.js` - Added user notifications on approve/reject
- 📝 `backend/sql/schema.sql` - Added notifications table

---

## Quick Integration Checklist

- [ ] Run database schema: `mysql -u root -p appointment_db < backend/sql/schema.sql`
- [ ] Verify all new files created
- [ ] Restart backend: `npm run dev` in backend folder
- [ ] Restart frontend: `npm run dev` in root folder
- [ ] Test user booking → admin sees badge
- [ ] Test admin approve → user sees notification
- [ ] Test marking notifications as read
- [ ] Test deleting notifications

---

## API Endpoints

### User Notifications
```
GET  /api/notifications              - Get all notifications
GET  /api/notifications/unread/count - Get unread count
PUT  /api/notifications/:id/read     - Mark single as read
PUT  /api/notifications/read/all     - Mark all as read
DELETE /api/notifications/:id        - Delete notification
```

### Admin Notifications
```
GET  /api/admin/notifications/pending-count - Get pending appointments count
```

### Auto-Generated Notifications
```
POST /api/appointments               - Creates admin notification
PUT  /api/admin/appointments/:id/approve - Creates user notification (success)
PUT  /api/admin/appointments/:id/reject  - Creates user notification (error)
```

---

## Notification Types & Icons

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| success | ✅ | Green | Appointment approved |
| error | ❌ | Red | Appointment rejected/cancelled |
| pending | ⏳ | Yellow | New appointment request |
| info | ℹ️ | Blue | General information |
| warning | ⚠️ | Orange | Warning message |

---

## User Flow Summary

### For Users
1. Book appointment
2. Wait for admin approval
3. Receive notification when approved/rejected
4. View notifications in Dashboard → Notifications
5. Mark as read / Delete as needed

### For Admin
1. See yellow banner with pending appointments count
2. Go to Admin Panel
3. Click Approve/Reject on pending appointments
4. User automatically receives notification
5. Count updates in real-time

---

## Key Features

✅ Real-time notification badges
✅ Persistent notification storage
✅ Mark as read/unread status
✅ Auto-dismiss toast notifications
✅ Color-coded by type
✅ Timestamp tracking
✅ Admin notification alerts
✅ Unread count display
✅ Auto-refresh every 5 seconds
✅ Responsive design (mobile-friendly)

---

## Database Schema

```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  appointment_id INT,
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);
```

---

## Troubleshooting Commands

```bash
# Check if notifications table exists
mysql -u root -p appointment_db -e "DESCRIBE notifications;"

# Count notifications for a user
mysql -u root -p appointment_db -e "SELECT COUNT(*) FROM notifications WHERE user_id=5;"

# View unread notifications
mysql -u root -p appointment_db -e "SELECT * FROM notifications WHERE is_read=FALSE;"

# Check backend API (with token)
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/notifications

# Clear all notifications (use with caution!)
mysql -u root -p appointment_db -e "DELETE FROM notifications;"
```

---

## Configuration

Edit these values in code to customize:

**Frontend (auto-refresh interval)**
- File: `src/pages/Dashboard/index.jsx`
- Line: `setInterval(loadUnreadCount, 5000);` (milliseconds)

**Frontend (toast auto-dismiss)**
- File: `src/context/NotificationContext.jsx`
- Line: `setTimeout(() => removeNotification(id), 5000);` (milliseconds)

**Admin (refresh pending count)**
- File: `src/pages/AdminDashboard.jsx`
- Line: `setInterval(() => loadNewAppointmentNotifications(), 5000);` (milliseconds)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Notifications not showing | Verify notifications table exists in DB |
| Unread count stuck | Refresh page or check API in browser DevTools |
| Admin banner not appearing | Verify GET /api/admin/notifications/pending-count works |
| Toast notifications don't disappear | Check NotificationContext.jsx timeout setting |
| Timestamp format wrong | Verify browser locale or format in toLocaleString() |

---

## Performance Tips

1. **Add database indexes** for faster queries:
   ```sql
   CREATE INDEX idx_user_notifications ON notifications(user_id, is_read);
   ```

2. **Limit notification history** to last 30 days:
   ```sql
   DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
   ```

3. **Archive old notifications** to separate table for analytics

4. **Reduce refresh frequency** on high-load systems (change 5000ms to higher)

---

## Future Enhancements

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications (service workers)
- [ ] WebSocket real-time updates
- [ ] Notification preferences/settings
- [ ] Bulk notification actions
- [ ] Notification history export
- [ ] Custom notification templates

---

## Support Resources

- **API Documentation**: See ARCHITECTURE.md
- **Setup Guide**: See SETUP_GUIDE.md
- **Implementation Details**: See NOTIFICATION_FEATURE.md

