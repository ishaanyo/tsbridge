-- Run this in your Neon SQL editor
CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,
  k_type TEXT,
  date TEXT,
  time TEXT,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  action TEXT NOT NULL,
  price NUMERIC,
  time TEXT,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signals_created ON signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
