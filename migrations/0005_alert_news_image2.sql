-- Segunda imagen (inline, dentro del cuerpo) con su propio crédito.
ALTER TABLE alert_news ADD COLUMN image2 TEXT;
ALTER TABLE alert_news ADD COLUMN image2_credit TEXT;
ALTER TABLE alert_news ADD COLUMN image2_credit_url TEXT;
