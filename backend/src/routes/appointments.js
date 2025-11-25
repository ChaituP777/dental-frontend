import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET MY APPOINTMENTS
router.get("/my", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, dentist, reason, datetime FROM appointments WHERE user_id = ? ORDER BY datetime",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// BOOK APPOINTMENT — allow unlimited bookings
router.post("/", requireAuth, async (req, res) => {
  const { dentist, reason, datetime } = req.body;

  try {
    await pool.query(
      "INSERT INTO appointments (user_id, dentist, reason, datetime) VALUES (?, ?, ?, ?)",
      [req.user.id, dentist, reason, datetime]
    );

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE APPOINTMENT
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
