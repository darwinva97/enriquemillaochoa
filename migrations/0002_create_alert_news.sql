CREATE TABLE IF NOT EXISTS alert_news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guid TEXT NOT NULL UNIQUE,
  source_url TEXT,
  source_title TEXT,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT 'Alerta',
  emoji TEXT NOT NULL DEFAULT '📰',
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published | rejected
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);

CREATE INDEX idx_alert_news_status ON alert_news(status, created_at);
