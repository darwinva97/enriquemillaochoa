import { defineCollection, z } from 'astro:content';

const noticias = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    fecha: z.date(),
    autor: z.string().default('Redaccion'),
    fuente: z.string().optional(),
    fuenteUrl: z.string().url().optional(),
    tag: z.string(),
    emoji: z.string(),
    resumen: z.string(),
    // Imagen de portada (banner) y de tarjeta; pueden ser la misma.
    cardImage: z.string().optional(),
    bannerImage: z.string().optional(),
    imageCredit: z.string().optional(),
    imageCreditUrl: z.string().url().optional(),
  }),
});

export const collections = { noticias };
