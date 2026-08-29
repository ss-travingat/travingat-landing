import { Pool } from 'pg';
const pool = new Pool({ connectionString: 'postgres://default:oT3BCHyU8xVb@ep-delicate-darkness-a1z38vj4-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require' });
pool.query('SELECT user_id, cover_image_url, profile_image_url FROM explorer_cards ORDER BY card_created DESC LIMIT 1', (err, res) => {
  console.log(res.rows);
  pool.end();
});
