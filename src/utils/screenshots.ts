/**
 * Resolves a project's carousel images from disk at build time.
 *
 * Locale files only name a folder (`"screenshots-prefix": "lumina-landing"`);
 * every image inside `public/projects/<prefix>/` is picked up automatically, so
 * dropping a new screenshot in the folder is enough to add a slide. Files are
 * ordered naturally, meaning `2.avif` comes before `10.avif`.
 */

import fs from "node:fs";
import path from "node:path";

/**
 * `public/` has no URL identity at build time — it is a plain folder that Astro
 * copies into `dist/` once rendering is done. It has to be read from the
 * project root on disk, which is the cwd for both `astro dev` and `astro build`.
 */
const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");

const IMAGE_EXTENSIONS = new Set([
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".webp",
]);

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const isImage = (name: string) =>
    IMAGE_EXTENSIONS.has(name.slice(name.lastIndexOf(".")).toLowerCase());

export function resolveScreenshots(prefix?: string): string[] {
    if (!prefix) return [];

    const directory = path.join(PROJECTS_DIR, prefix);

    let entries: string[];

    try {
        entries = fs.readdirSync(directory);
    } catch {
        console.warn(`[screenshots] No such folder: ${directory}`);
        return [];
    }

    return entries
        .filter(isImage)
        .sort(collator.compare)
        .map((name) => `/projects/${prefix}/${name}`);
}
