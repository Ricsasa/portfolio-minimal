/**
 * Minimal Markdown renderer for the strings stored in `public/locales`.
 *
 * i18next returns plain strings, so rich descriptions are authored as Markdown
 * inside the JSON files and turned into HTML here. Only the subset actually
 * used by the locale files is supported: headings, paragraphs, unordered and
 * ordered lists, and the inline marks `**bold**`, `_italic_`, `` `code` `` and
 * `[text](url)`. Single newlines inside a block are kept as line breaks.
 */

const CLASSES = {
    heading: "text-base font-bold text-black-tertiary",
    paragraph: "text-sm text-black-secondary",
    list: "space-y-1 list-disc pl-5 text-sm text-black-secondary",
    listItem: "pl-1",
    orderedList: "space-y-1 list-decimal pl-5 text-sm text-black-secondary",
    strong: "font-bold text-black-tertiary",
    emphasis: "italic",
    code: "font-mono text-xs bg-custom-green-100 px-1 py-0.5",
    link: "text-black-primary underline",
} as const;

const HEADING_PATTERN = /^(#{1,3})\s+(.*)$/;
const UNORDERED_ITEM_PATTERN = /^[-*]\s+(.*)$/;
const ORDERED_ITEM_PATTERN = /^\d+[.)]\s+(.*)$/;

// Sentinel that cannot appear in translated copy, used to park code spans while
// the remaining inline marks are resolved.
const CODE_SENTINEL = "@@code@@";
const CODE_SPAN_PATTERN = new RegExp(`${CODE_SENTINEL}(\\d+)${CODE_SENTINEL}`, "g");

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
    const codeSpans: string[] = [];
    const withoutCode = text.replace(
        /`([^`]+)`/g,
        (_match, code: string) =>
            `${CODE_SENTINEL}${codeSpans.push(code) - 1}${CODE_SENTINEL}`,
    );

    const html = escapeHtml(withoutCode)
        .replace(
            /\[([^\]]+)\]\(([^)\s]+)\)/g,
            `<a href="$2" class="${CLASSES.link}" target="_blank" rel="noopener noreferrer">$1</a>`,
        )
        .replace(/\*\*([^*]+)\*\*/g, `<strong class="${CLASSES.strong}">$1</strong>`)
        .replace(/(?<![\w*])[*_]([^*_]+)[*_](?![\w*])/g, `<em class="${CLASSES.emphasis}">$1</em>`)
        .replace(/\n/g, "<br />");

    return html.replace(
        CODE_SPAN_PATTERN,
        (_match, index: string) =>
            `<code class="${CLASSES.code}">${escapeHtml(codeSpans[Number(index)]!)}</code>`,
    );
}

function renderBlock(block: string): string {
    const lines = block.split("\n");

    const heading = lines[0]!.match(HEADING_PATTERN);
    if (lines.length === 1 && heading) {
        const level = heading[1]!.length + 1;
        return `<h${level} class="${CLASSES.heading}">${renderInline(heading[2]!)}</h${level}>`;
    }

    const unorderedItems = lines.map((line) => line.match(UNORDERED_ITEM_PATTERN)?.[1]);
    if (unorderedItems.every((item) => item !== undefined)) {
        const rendered = unorderedItems
            .map((item) => `<li class="${CLASSES.listItem}">${renderInline(item!)}</li>`)
            .join("");
        return `<ul class="${CLASSES.list}">${rendered}</ul>`;
    }

    const orderedItems = lines.map((line) => line.match(ORDERED_ITEM_PATTERN)?.[1]);
    if (orderedItems.every((item) => item !== undefined)) {
        const rendered = orderedItems.map((item) => `<li>${renderInline(item!)}</li>`).join("");
        return `<ol class="${CLASSES.orderedList}">${rendered}</ol>`;
    }

    return `<p class="${CLASSES.paragraph}">${renderInline(block)}</p>`;
}

export function renderMarkdown(markdown: string | undefined): string {
    if (!markdown) return "";

    return markdown
        .trim()
        .split(/\n{2,}/)
        .map((block) => renderBlock(block.trim()))
        .join("");
}
