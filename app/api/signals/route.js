import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM signals ORDER BY created_at DESC LIMIT 100`;
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { symbol, side, k_type, date, time, price } = await req.json();
    if (!symbol || !side) return Response.json({ error: 'symbol and side required' }, { status: 400 });
    const [row] = await sql`
      INSERT INTO signals (symbol, side, k_type, date, time, price)
      VALUES (${symbol}, ${side}, ${k_type || null}, ${date || null}, ${time || null}, ${price || null})
      RETURNING *
    `;
    return Response.json(row, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
