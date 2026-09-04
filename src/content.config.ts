import { defineCollection, z, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const rooms = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/rooms' }),
  schema: z.object({
    // e.g. "01"
    number: z.string(),
    // e.g. "qui-es-catala" (matches file slug + exhibit.room)
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    order: z.number(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    organisation: z.string().optional(),
    role: z.string().optional(),
    note: z.string().optional(),
    fictional: z.boolean().default(true),
  }),
});

const exhibits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/exhibits' }),
  schema: z.object({
      id: z.string(),
      title: z.string(),
      date: z.coerce.date(),
      person: z.object({
        name: z.string(),
        slug: reference('people'),
      }),
      organisation: z
        .object({
          name: z.string(),
          slug: z.string(),
        })
        .optional(),
      room: reference('rooms'),
      topics: z.array(z.string()).default([]),
      source: z.object({
        platform: z.string(),
        url: z.string().url(),
        archive_url: z.string().url().optional(),
      }),
      contextual_sources: z
        .array(
          z.object({
            publication: z.string(),
            title: z.string(),
            url: z.string().url().optional(),
          })
        )
        .default([]),
      media: z
        .object({
          image: z.string().optional(),
          alt: z.string(),
        })
        .optional(),
      quote: z.string(),
      verification: z.object({
        status: z.enum(['verified', 'unverified', 'placeholder']),
        checked: z.coerce.date().optional(),
      }),
      // MVP guard: every seeded exhibit is fictional until real research replaces it.
      fictional: z.boolean().default(true),
      featured: z.boolean().default(false),
    }),
});

export const collections = { rooms, people, exhibits };
