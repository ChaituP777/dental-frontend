import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ===========================
// GET USER NOTIFICATIONS
// ===========================
router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// GET UNREAD NOTIFICATION COUNT
// ===========================
router.get("/unread/count", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ unreadCount: rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// MARK NOTIFICATION AS READ
// ===========================
router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// MARK ALL NOTIFICATIONS AS READ
// ===========================
router.put("/read/all", requireAuth, async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================
// DELETE NOTIFICATION
// ===========================
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
