import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.string().default('Mindset'),
			readingTime: z.string().optional().default('5 menit baca'),
			featured: z.boolean().optional().default(false),
			author: z.string().optional().default('Tim Redaksi'),
		}),
});

export const collections = { blog };
