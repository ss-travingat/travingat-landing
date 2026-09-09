const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env" });

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const res = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'explorer_cards';
  `;
  console.log(res);
}
run();
