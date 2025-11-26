import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// =========================
// GET ONLY USER ACTIVE APPOINTMENTS
// =========================
router.get("/my", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, dentist, reason, datetime FROM appointments WHERE user_id = ? AND status='booked' ORDER BY datetime ASC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// BOOK NEW APPOINTMENT
// =========================
router.post("/", requireAuth, async (req, res) => {
  const { dentist, reason, datetime } = req.body;

  if (!dentist || !reason || !datetime)
    return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query(
      "INSERT INTO appointments (user_id, dentist, reason, datetime, status) VALUES (?, ?, ?, ?, 'booked')",
      [req.user.id, dentist, reason, datetime]
    );
    res.json({ message: "Appointment Booked Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// RESCHEDULE APPOINTMENT
// =========================
router.put("/:id", requireAuth, async (req, res) => {
  const { dentist, reason, datetime } = req.body;

  if (!dentist || !reason || !datetime)
    return res.status(400).json({ message: "Missing fields" });

  try {
    await pool.query(
      "UPDATE appointments SET dentist=?, reason=?, datetime=?, status='booked' WHERE id=? AND user_id=?",
      [dentist, reason, datetime, req.params.id, req.user.id]
    );
    res.json({ message: "Appointment Rescheduled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// CANCEL (SOFT DELETE)
// =========================
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await pool.query(
      "UPDATE appointments SET status='cancelled' WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Appointment Cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
