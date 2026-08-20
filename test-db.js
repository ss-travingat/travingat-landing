import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const result = await sql`
      SELECT 
        u.id, 
        u.email, 
        u.first_name, 
        u.last_name, 
        u.country, 
        u.visited_count, 
        u.links,
        w.created_at
      FROM waitlist w
      JOIN users u ON w.email = u.email
      WHERE w.get_featured_status = 'Created'
      ORDER BY w.created_at DESC
      LIMIT 1;
    `;
    console.log("Query succeeded!");
  } catch (err) {
    console.error("Query failed:", err);
  }
}
main();
