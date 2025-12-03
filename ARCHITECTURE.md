# Notification System - Data Flow & Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NotificationProvider (Context)                      │   │
│  │  - Manages global notification state                 │   │
│  │  - addNotification(), removeNotification()           │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                    │
│                          ├─ NotificationCenter               │
│                          │  - Toast notifications            │
│                          │  - Persistent notifications       │
│                          │  - Persistent display              │
│                          │                                    │
│                          └─ Components using useNotifications()
│                             - Navbar (show count)            │
│                             - Dashboard (Notifications page) │
│                             - AdminDashboard (alert banner)  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  User Notification Flow                              │   │
│  │                                                       │   │
│  │  1. User books appointment                           │   │
│  │     └─ POST /api/appointments                        │   │
│  │        └─ Backend creates notification (admin)       │   │
│  │                                                       │   │
│  │  2. Admin approves/rejects                           │   │
│  │     └─ PUT /api/admin/appointments/:id/approve       │   │
│  │        └─ Backend creates notification (user)        │   │
│  │           └─ Frontend fetches GET /api/notifications │   │
│  │              └─ Displays in Notifications page       │   │
│  │                                                       │   │
│  │  3. User views notifications                         │   │
│  │     └─ GET /api/notifications                        │   │
│  │     └─ PUT /api/notifications/:id/read               │   │
│  │     └─ DELETE /api/notifications/:id                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                             ↕
                        Axios API Calls
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Notification Routes (/api/notifications)           │   │
│  │                                                       │   │
│  │  GET /     → Get all user notifications              │   │
│  │  GET /unread/count  → Get unread count               │   │
│  │  PUT /:id/read      → Mark as read                   │   │
│  │  PUT /read/all      → Mark all as read               │   │
│  │  DELETE /:id        → Delete notification            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Appointment Routes (/api/appointments)              │   │
│  │                                                       │   │
│  │  POST /     → Book appointment                       │   │
│  │            └─ Create admin notification              │   │
│  │                                                       │   │
│  │  PUT /:id   → Reschedule appointment                 │   │
│  │            └─ Create notification (pending)          │   │
│  │                                                       │   │
│  │  DELETE /:id → Cancel appointment                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Admin Routes (/api/admin)                           │   │
│  │                                                       │   │
│  │  PUT /appointments/:id/approve                       │   │
│  │     └─ Update status to 'booked'                     │   │
│  │     └─ Create user notification (success)            │   │
│  │                                                       │   │
│  │  PUT /appointments/:id/reject                        │   │
│  │     └─ Update status to 'cancelled'                  │   │
│  │     └─ Create user notification (error)              │   │
│  │                                                       │   │
│  │  GET /notifications/pending-count                    │   │
│  │     └─ Return count of pending appointments          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                             ↕
                        MySQL Queries
                             ↕
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  notifications TABLE                                 │   │
│  │                                                       │   │
│  │  Columns:                                            │   │
│  │  - id (PK)                                           │   │
│  │  - user_id (FK) - recipient of notification          │   │
│  │  - appointment_id (FK)                               │   │
│  │  - type (success, error, pending, info)              │   │
│  │  - title (notification heading)                      │   │
│  │  - message (notification body)                       │   │
│  │  - is_read (boolean)                                 │   │
│  │  - created_at (timestamp)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Sample Records:                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ id | user_id | appt_id | type    | title            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1  | 5       | 10      | success | ✅ Appointment   │   │
│  │    |         |         |         | Approved!        │   │
│  │ 2  | 5       | 11      | error   | ❌ Appointment   │   │
│  │    |         |         |         | Not Available    │   │
│  │ 3  | 0       | 12      | pending | 📅 New Appt      │   │
│  │    |         |         |         | Request          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Notification Flow Sequences

### Sequence 1: User Books Appointment → Admin Notified

```
User                         Frontend          Backend              Database
 │                             │                  │                    │
 ├─ Click "Book Appointment"   │                  │                    │
 │                             │                  │                    │
 ├──────── POST /appointments ─→                  │                    │
 │                             │                  │                    │
 │                             │─ Insert appointment           │
 │                             │─────────────────────────────→│
 │                             │                  ├─ insert appt row   │
 │                             │                  │                    │
 │                             │─ Insert admin notification    │
 │                             │─────────────────────────────→│
 │                             │                  ├─ insert notif row  │
 │                             │                  │ (user_id=0)        │
 │                             │                  │                    │
 │                             │←──── 201 Created ─            │
 │←────────── Response ────────│                  │                    │
 │                             │                  │                    │
 ├─ Logout                     │                  │                    │
 │                             │                  │                    │

Admin                        Frontend          Backend              Database
 ├─ Login as admin            │                  │                    │
 │                             │                  │                    │
 ├──── GET /admin/appointments │                  │                    │
 │                             │                  │                    │
 │                             │─ SELECT pending appointments          │
 │                             │─────────────────────────────→│
 │                             │                  ├─ query appointments│
 │                             │                  ←────────┤
 │                             │←──── Results ────│                    │
 │←──────── Display ───────────│                  │                    │
 │                             │                  │                    │
 ├─ Sees yellow banner! 🟡     │                  │                    │
```

### Sequence 2: Admin Approves → User Notified

```
Admin                        Frontend          Backend              Database
 │                             │                  │                    │
 ├─ Click "Approve"            │                  │                    │
 │                             │                  │                    │
 ├── PUT /admin/appointments/10/approve ──→        │                    │
 │                             │                  │                    │
 │                             │─ UPDATE status='booked'               │
 │                             │─────────────────────────────→│
 │                             │                  ├─ update appt       │
 │                             │                  │                    │
 │                             │─ SELECT user_id, dentist from appt    │
 │                             │─────────────────────────────→│
 │                             │                  ├─ query appointment │
 │                             │                  ←────────┤
 │                             │─ INSERT user notification    │
 │                             │   (user_id=5, type=success) │
 │                             │─────────────────────────────→│
 │                             │                  ├─ insert notif row  │
 │                             │                  │                    │
 │                             │←──── 200 OK ─────│                    │
 │←────────── Response ────────│                  │                    │
 │                             │                  │                    │

User                         Frontend          Backend              Database
 ├─ Login (user_id=5)          │                  │                    │
 │                             │                  │                    │
 ├─ Dashboard loads            │                  │                    │
 │                             │                  │                    │
 ├─ Sidebar shows unread       │                  │                    │
 │  count badge: 1 🔴          │                  │                    │
 │                             │                  │                    │
 ├─ Click "Notifications"      │                  │                    │
 │                             │                  │                    │
 ├──────── GET /notifications ──→                  │                    │
 │                             │                  │                    │
 │                             │─ SELECT * FROM notifications where    │
 │                             │  user_id=5 ORDER BY created_at DESC   │
 │                             │─────────────────────────────→│
 │                             │                  ├─ query notifications
 │                             │                  ←────────┤
 │                             │←──── Notifs ─────│                    │
 │←─ Display notifications ────│                  │                    │
 │                             │                  │                    │
 ├─ Sees ✅ notification:      │                  │                    │
 │  "Appointment Approved!"    │                  │                    │
 │  with dentist name & time   │                  │                    │
```

### Sequence 3: User Marks Notification as Read

```
User                         Frontend          Backend              Database
 │                             │                  │                    │
 ├─ Click "Read" button        │                  │                    │
 │                             │                  │                    │
 ├──── PUT /notifications/5/read ──→               │                    │
 │                             │                  │                    │
 │                             │─ UPDATE notifications SET               │
 │                             │  is_read=TRUE WHERE id=5               │
 │                             │  AND user_id={current_user_id}         │
 │                             │─────────────────────────────→│
 │                             │                  ├─ update row        │
 │                             │                  │                    │
 │                             │←──── 200 OK ─────│                    │
 │←────────── Response ────────│                  │                    │
 │                             │                  │                    │
 ├─ UI updates:                │                  │                    │
 │  - Remove "Read" button     │                  │                    │
 │  - Gray out notification    │                  │                    │
 │  - Update unread count      │                  │                    │
```

---

## Database Query Examples

### Create notification when booking appointment
```sql
INSERT INTO notifications 
(user_id, appointment_id, type, title, message, is_read)
VALUES (0, 12, 'pending', '📅 New Appointment Request', 
  'John Smith has requested appointment with Dr. Mehta on 2025-03-15 10:00:00', FALSE);
```

### Create notification when admin approves
```sql
INSERT INTO notifications 
(user_id, appointment_id, type, title, message, is_read)
VALUES (5, 12, 'success', '✅ Appointment Approved!', 
  'Your appointment with Dr. Mehta has been approved and confirmed.', FALSE);
```

### Get all unread for user
```sql
SELECT * FROM notifications 
WHERE user_id = 5 AND is_read = FALSE 
ORDER BY created_at DESC;
```

### Mark as read
```sql
UPDATE notifications 
SET is_read = TRUE 
WHERE id = 1 AND user_id = 5;
```

### Get pending count for admin
```sql
SELECT COUNT(*) as count FROM appointments WHERE status = 'pending';
```

---

## State Management Flow

```
Global Notification Context
    ↓
    ├─ notifications[] (array of all notifications)
    ├─ addNotification(notification) → adds to state
    ├─ removeNotification(id) → removes from state
    └─ clearAll() → clears all
        ↓
NotificationCenter Component
    ├─ Maps toast notifications to display
    ├─ Maps persistent notifications
    └─ Renders NotificationDisplay for each
        ↓
User sees notifications
on screen automatically
```

---

## Key Design Decisions

1. **User ID 0 for Admin Notifications**: Admin notifications use user_id=0 to avoid sending to specific users initially

2. **5-Second Auto-Refresh**: Balance between real-time updates and server load

3. **Toast vs Persistent**: Toast for temporary actions, persistent for important updates

4. **Color Coding**: Helps users quickly identify notification importance

5. **Separate Notification Page**: Allows users to review historical notifications

6. **Unread Badge**: Quick visual indicator in sidebar for unread count

