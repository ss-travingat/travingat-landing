const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not found");
    return;
  }
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `;
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
