/**
 * Resolves a project's carousel images from disk at build time.
 *
 * Locale files only name a folder (`"screenshots-prefix": "lumina-landing"`);
 * every image inside `public/projects/<prefix>/` is picked up automatically, so
 * dropping a new screenshot in the folder is enough to add a slide. Files are
 * ordered naturally, meaning `2.avif` comes before `10.avif`.
 */

import fs from "node:fs";

const PROJECTS_DIR = new URL("../../public/projects/", import.meta.url);

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

    const directory = new URL(`${prefix}/`, PROJECTS_DIR);

    let entries: string[];

    try {
        entries = fs.readdirSync(directory);
    } catch {
        console.warn(`[screenshots] No such folder: public/projects/${prefix}`);
        return [];
    }

    return entries
        .filter(isImage)
        .sort(collator.compare)
        .map((name) => `/projects/${prefix}/${name}`);
}
