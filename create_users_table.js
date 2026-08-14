const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        country VARCHAR(255),
        visited_countries TEXT[],
        profile_image_url VARCHAR(1024),
        cover_image_url VARCHAR(1024),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Table 'users' created successfully.");
  } catch (e) {
    console.error("Error creating table:", e);
  }
}
run();
