import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Get unread notification count
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

export default router;
