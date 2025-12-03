import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin")
    return res.status(401).json({ message: "Admin Only" });
  next();
}

// Get all users
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const [rows] = await pool.query("SELECT id,name,email FROM users ORDER BY id");
  res.json(rows);
});

// Get all appointments including cancelled
router.get("/appointments", requireAuth, requireAdmin, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT a.*, u.name AS user_name, u.email AS user_email
    FROM appointments a
    JOIN users u ON a.user_id=u.id
    ORDER BY a.datetime DESC
  `);

  res.json(rows);
});

// Approve appointment (pending -> booked)
router.put("/appointments/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get appointment details
    const [appts] = await pool.query(
      "SELECT user_id, dentist FROM appointments WHERE id=?",
      [req.params.id]
    );

    if (!appts.length) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { user_id, dentist } = appts[0];

    // Update appointment status
    await pool.query(
      "UPDATE appointments SET status='booked' WHERE id=?",
      [req.params.id]
    );

    // Create notification for user
    await pool.query(
      "INSERT INTO notifications (user_id, appointment_id, type, title, message, is_read) VALUES (?, ?, ?, ?, ?, FALSE)",
      [
        user_id,
        req.params.id,
        "success",
        "✅ Appointment Approved!",
        `Your appointment with ${dentist} has been approved and confirmed.`
      ]
    );

    res.json({ message: "Appointment Approved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject appointment (pending/booked -> cancelled)
router.put("/appointments/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get appointment details
    const [appts] = await pool.query(
      "SELECT user_id, dentist FROM appointments WHERE id=?",
      [req.params.id]
    );

    if (!appts.length) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const { user_id, dentist } = appts[0];

    // Update appointment status
    await pool.query(
      "UPDATE appointments SET status='cancelled' WHERE id=?",
      [req.params.id]
    );

    // Create notification for user
    await pool.query(
      "INSERT INTO notifications (user_id, appointment_id, type, title, message, is_read) VALUES (?, ?, ?, ?, ?, FALSE)",
      [
        user_id,
        req.params.id,
        "error",
        "❌ Appointment Not Available",
        `Your appointment with ${dentist} could not be confirmed. Please reschedule with another available time or dentist.`
      ]
    );

    res.json({ message: "Appointment Rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// GET NEW PENDING APPOINTMENTS (for admin notifications)
// ===========================
router.get("/notifications/pending-count", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'"
    );
    res.json({ pendingCount: rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
