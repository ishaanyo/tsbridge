import { neon } from '@neondatabase/serverless';

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
}

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100`;
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const sql = getSql();
    const { symbol, action, price, time, order_id } = await req.json();
    if (!symbol || !action) return Response.json({ error: 'symbol and action required' }, { status: 400 });
    const [row] = await sql`
      INSERT INTO orders (symbol, action, price, time, order_id)
      VALUES (${symbol}, ${action}, ${price || null}, ${time || null}, ${order_id || null})
      RETURNING *
    `;
    return Response.json(row, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
