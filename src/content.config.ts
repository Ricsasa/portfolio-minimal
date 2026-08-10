import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({
        pattern: "**/index.mdx",
        base: "./src/content/blog",
        // Entry ids come in as "<locale>/<slug>/index.mdx" — drop the locale
        // segment and the filename so a translated pair shares one id.
        generateId: ({ entry }) => entry.split("/").slice(1, -1).join("/"),
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            cover: image().optional(),
            coverAlt: z.string().optional(),
            tags: z.array(z.string()).default([]),
            lang: z.enum(["es-MX", "en-US"]),
            draft: z.boolean().default(false),
        }),
});

export const collections = { blog };
