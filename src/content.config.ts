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
    imagen: z.string().optional(),
  }),
});

export const collections = { noticias };
