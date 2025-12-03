# Notification Feature - Setup & Deployment Guide

## Prerequisites
- Node.js backend running
- MySQL database with updated schema
- React frontend with all dependencies installed

---

## Step 1: Database Setup

Run the updated SQL schema to add the notifications table:

```bash
# In your MySQL client or terminal:
mysql -u root -p appointment_db < backend/sql/schema.sql
```

This will create the `notifications` table if it doesn't exist.

---

## Step 2: Backend Setup

### Update Server Dependencies
No new dependencies needed - all using existing packages.

### Verify Backend Routes
Ensure the following files are updated:
- ✅ `backend/src/index.js` - registers notification routes
- ✅ `backend/src/routes/notifications.js` - new endpoints
- ✅ `backend/src/routes/appointments.js` - creates admin notifications
- ✅ `backend/src/routes/admin.js` - creates user notifications

### Start Backend
```bash
cd backend
npm install
npm run dev
```

The backend should now expose:
- `POST /api/appointments` - Creates admin notification
- `PUT /api/admin/appointments/:id/approve` - Creates user notification
- `PUT /api/admin/appointments/:id/reject` - Creates user notification
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/admin/notifications/pending-count` - Get pending count

---

## Step 3: Frontend Setup

### Verify Frontend Files
Check these files exist:
- ✅ `src/context/NotificationContext.jsx`
- ✅ `src/components/NotificationCenter.jsx`
- ✅ `src/components/NotificationDisplay.jsx`
- ✅ `src/pages/Dashboard/Notifications.jsx`
- ✅ Updated `src/App.jsx` (with NotificationProvider)
- ✅ Updated `src/pages/Dashboard/index.jsx` (with notifications route)
- ✅ Updated `src/pages/AdminDashboard.jsx` (with notification alert)
- ✅ Updated `src/index.css` (with animation)

### Install Frontend Dependencies
```bash
cd .
npm install
```

### Start Frontend
```bash
npm run dev
```

Frontend should now be available at: `http://localhost:5173`

---

## Step 4: Testing the Notification System

### Test User Appointment Approval Notification

1. **User Login**: Login as a regular user
2. **Book Appointment**: Go to Dashboard → Book Appointment
3. **Fill Details**: Select dentist, date, time, reason
4. **Submit**: Click "Book Appointment"
5. **Logout**: Logout and login as admin (admin@gmail.com)
6. **Admin Panel**: Go to Admin Panel
7. **See Banner**: Notice yellow banner with pending appointments
8. **Approve**: Click Approve button on a pending appointment
9. **User Check**: Logout and login as the user
10. **Verify**: Go to Dashboard → Notifications
11. **Expected**: See "✅ Appointment Approved!" notification

### Test User Appointment Rejection Notification

1. Follow steps 1-8 above (approve appointment first)
2. **Reject**: Click Reject/Cancel button
3. **User Check**: Logout and login as the user
4. **Verify**: Go to Dashboard → Notifications
5. **Expected**: See "❌ Appointment Not Available" notification

### Test Admin Pending Count

1. **Admin View**: Login as admin
2. **Dashboard**: Go to Admin Panel
3. **Notice**: Yellow banner shows pending count
4. **Auto-Refresh**: Wait 5 seconds after user books new appointment
5. **Verify**: Count updates without page refresh

### Test Notification Management

1. **Go to Notifications**: Dashboard → Notifications
2. **Filter**: Click "Unread" filter
3. **Mark as Read**: Click "Read" button on unread notifications
4. **Mark All**: Click "Mark All as Read"
5. **Delete**: Click "Delete" button
6. **Verify**: Notifications disappear from list

---

## Troubleshooting

### Notifications Not Appearing

**Issue**: User doesn't see notifications after approval
- Check database: Verify notifications table exists
  ```sql
  SELECT * FROM notifications;
  ```
- Check backend logs: Verify notification creation endpoints are being called
- Check frontend console: Look for API errors

### Pending Count Not Updating

**Issue**: Admin doesn't see pending count update
- Verify backend is returning correct count:
  ```bash
  curl http://localhost:4000/api/admin/notifications/pending-count \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```
- Check frontend console for fetch errors
- Verify auto-refresh interval (5 seconds)

### Notifications Not Loading in Dashboard

**Issue**: Notifications page shows loading forever
- Check API token in localStorage
- Verify backend is running: `curl http://localhost:4000`
- Check backend logs for database connection errors

### Database Errors

**Issue**: "Unknown column" or table doesn't exist
- Re-run schema.sql:
  ```bash
  mysql -u root -p appointment_db < backend/sql/schema.sql
  ```
- Verify column names match code

---

## Feature Checklist

- [ ] User sees notifications when appointment approved
- [ ] User sees notifications when appointment rejected
- [ ] User can filter notifications (unread/all)
- [ ] User can mark notifications as read
- [ ] User can delete notifications
- [ ] Unread count badge appears in sidebar
- [ ] Admin sees yellow banner with pending count
- [ ] Admin sees count update in real-time
- [ ] Notification timestamps are accurate
- [ ] Notifications are color-coded correctly

---

## Performance Considerations

- Notifications auto-refresh every 5 seconds (configurable in code)
- Toast notifications auto-dismiss after 5 seconds
- Database indexes recommended on `user_id` and `is_read` columns:
  ```sql
  CREATE INDEX idx_user_id ON notifications(user_id);
  CREATE INDEX idx_is_read ON notifications(is_read);
  ```

---

## Future Enhancements

1. **Email Notifications**: Send email when appointment is approved/rejected
2. **Real-Time Updates**: Implement WebSocket for instant updates
3. **Notification Preferences**: Let users choose notification channels
4. **Admin Notifications**: Store admin notifications in DB instead of transient
5. **Bulk Actions**: Approve/reject multiple appointments at once
6. **Notification Archive**: Keep notifications for extended period

---

## Support

For issues or questions, check:
1. Browser console (F12) for client-side errors
2. Backend terminal for server errors
3. MySQL logs for database errors
4. Database content: `SELECT * FROM notifications;`

