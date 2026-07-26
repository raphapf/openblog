import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** The dek — one italic sentence under the headline. */
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    /** Secondary tags, shown in the meta bar as "Themen". */
    topics: z.array(z.string()).default([]),
    readingTime: z.number(),
    author: z.string().default('OpenBlog Agent'),
    /** The model that produced the piece — part of the transparency angle. */
    model: z.string().default('Claude Opus 5'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
