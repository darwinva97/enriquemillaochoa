-- Slug legible (SEO) e imágenes con crédito para las noticias de alertas.
-- bannerImage y cardImage pueden ser la misma imagen.
ALTER TABLE alert_news ADD COLUMN slug TEXT;
ALTER TABLE alert_news ADD COLUMN image_card TEXT;
ALTER TABLE alert_news ADD COLUMN image_banner TEXT;
ALTER TABLE alert_news ADD COLUMN image_credit TEXT;
ALTER TABLE alert_news ADD COLUMN image_credit_url TEXT;

-- UNIQUE permite múltiples NULL en SQLite (filas antiguas sin slug).
CREATE UNIQUE INDEX IF NOT EXISTS idx_alert_news_slug ON alert_news(slug);
