-- Petition signatures. Run: wrangler d1 execute petition --file=schema.sql
CREATE TABLE IF NOT EXISTS signatures (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  place      TEXT DEFAULT '',
  msg        TEXT DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sig_id ON signatures(id DESC);
