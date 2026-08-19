export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(new RegExp(String.raw`\p{M}`, "gu"), "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
