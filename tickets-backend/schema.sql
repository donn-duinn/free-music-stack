-- Free Music Stack — ticketing D1 schema
CREATE TABLE IF NOT EXISTS tickets (
  code       TEXT PRIMARY KEY,           -- random unguessable ticket id (also the QR payload)
  event      TEXT NOT NULL,
  buyer      TEXT,
  status     TEXT NOT NULL DEFAULT 'valid',  -- valid | used
  issued_at  TEXT NOT NULL,
  used_at    TEXT
);
CREATE INDEX IF NOT EXISTS idx_event ON tickets(event);
