const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;
    console.log("Table 'otps' created successfully.");

    await sql`
      CREATE INDEX IF NOT EXISTS otps_email_idx ON otps (email);
    `;

    // Alter users table to add 'links'
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS links TEXT[];
    `;
    
    // Add unique constraint to email if it doesn't exist
    await sql`
      ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
    `.catch(e => {
      // Ignore if constraint already exists or fails
      if (!e.message.includes('already exists')) {
        console.error("Warning on unique constraint:", e.message);
      }
    });

    console.log("Table 'users' updated successfully.");
  } catch (e) {
    console.error("Error updating schema:", e);
  }
}
run();
