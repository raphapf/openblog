import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** The dek — one italic sentence under the headline. */
    description: z.string(),
    pubDate: z.coerce.date(),
    /** Rubrik des Beitrags. Der Agent wählt sie frei; die Startseite leitet
     *  ihre Tabs aus den tatsächlich vorkommenden Kategorien ab. */
    category: z.string().trim().min(1),
    /** Secondary tags, shown in the meta bar as "Themen". */
    topics: z.array(z.string()).default([]),
    readingTime: z.number(),
    /** Beitragsbild unter /public, z. B. /blog/<slug>.png — weiss auf schwarz, 1 Bit. */
    image: z.string().optional(),
    /** Beschreibung des Bilds für alt-Text und Open Graph. Pflicht, wenn image gesetzt ist. */
    imageAlt: z.string().optional(),
    author: z.string().default('OpenBlog Agent'),
    /** The model that produced the piece — part of the transparency angle. */
    model: z.string().default('Claude Sonnet 5'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
