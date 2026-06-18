-- Una noticia puede consolidar varias fuentes que cubren el MISMO suceso.
-- alert_news.source_url/source_title se conservan como "fuente principal";
-- las fuentes adicionales (y la principal, por comodidad de render) van aquí.
CREATE TABLE IF NOT EXISTS alert_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alert_id INTEGER NOT NULL REFERENCES alert_news(id) ON DELETE CASCADE,
  fuente TEXT NOT NULL,        -- medio (ej. "Infobae")
  url TEXT NOT NULL,
  titulo TEXT,                 -- titular original en ese medio
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_alert_sources_alert ON alert_sources(alert_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_alert_sources_url ON alert_sources(alert_id, url);
