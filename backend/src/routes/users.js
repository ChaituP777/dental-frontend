import express from "express";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET PROFILE
router.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE PROFILE
router.put("/me", requireAuth, async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, req.user.id]
    );

    res.json({ message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
