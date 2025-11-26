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

export default router;
