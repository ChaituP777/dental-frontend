import bcrypt from "bcryptjs";
import pool from "./src/db.js";

async function createAdmin() {
  try {
    const email = "admin@gmail.com";
    const password = "password123"; // You can change this if you want
    
    // 1. Hash the password (YES, it is absolutely necessary to use bcrypt!)
    // The login route uses bcrypt.compare(), so plain text passwords will fail to login.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert the admin with ID = 0
    // We explicitly set ID = 0 because your code saves admin notifications to user_id = 0!
    // This fixes the 'violates foreign key constraint' error you got earlier.
    await pool.query(
      `INSERT INTO users (id, name, email, password) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      [0, "Admin System", email, hashedPassword]
    );

    console.log("✅ Admin user successfully created!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  } finally {
    // Close database connection pool
    await pool.end();
  }
}

createAdmin();
