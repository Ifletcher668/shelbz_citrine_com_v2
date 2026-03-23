/**
 * Unit tests for frontend/lib/marked-extensions.js
 *
 * Tests the marked extensions via wysiwygMarked.parse() and the
 * exported utility functions extractRelationRefs / parseWithRelations.
 */

import {
  wysiwygMarked,
  extractRelationRefs,
  parseWithRelations,
} from "../../lib/marked-extensions.js";

// ─── Highlight extension (==text==) ─────────────────────────────────────────

test("highlight: ==text== renders as <mark class='md-highlight'>", () => {
  const html = wysiwygMarked.parse("==highlighted==");
  expect(html).toContain('<mark class="md-highlight">highlighted</mark>');
});

test("highlight: unmatched == does not produce mark", () => {
  const html = wysiwygMarked.parse("price == value");
  expect(html).not.toContain("<mark");
});

// ─── Colored text extension ──────────────────────────────────────────────────

test("coloredText: renders span with css var", () => {
  const html = wysiwygMarked.parse("{color:pale-gold}golden text{/color}");
  expect(html).toContain('style="color:var(--color-pale-gold)"');
  expect(html).toContain("golden text");
});

test("coloredText: disallowed color names are not rendered", () => {
  const html = wysiwygMarked.parse("{color:danger-zone}text{/color}");
  expect(html).not.toContain('--color-danger-zone');
});

test("coloredText: semantic theme colors are allowed", () => {
  const html = wysiwygMarked.parse("{color:accent}accent text{/color}");
  expect(html).toContain('--color-accent');
});

// ─── Button link extension ───────────────────────────────────────────────────

test("buttonLink: renders <a> with btn-primary class", () => {
  const html = wysiwygMarked.parse("[Click me](/path){.btn-primary}");
  expect(html).toContain('<a href="/path"');
  expect(html).toContain('class="btn-primary"');
  expect(html).toContain("Click me");
});

test("buttonLink: btn-secondary class is applied", () => {
  const html = wysiwygMarked.parse("[Book](/book){.btn-secondary}");
  expect(html).toContain('class="btn-secondary"');
});

test("buttonLink: lg modifier produces btn-lg class", () => {
  const html = wysiwygMarked.parse("[Big Button](/path){.btn-primary .lg}");
  expect(html).toContain("btn-lg");
});

test("buttonLink: target=_blank adds rel noopener noreferrer", () => {
  const html = wysiwygMarked.parse("[Link](/url){.btn-primary target=_blank}");
  expect(html).toContain('target="_blank"');
  expect(html).toContain('rel="noopener noreferrer"');
});

test("buttonLink: sanitizes javascript: URL to #", () => {
  // Use a URL without parens so the button tokenizer regex captures it
  // (parentheses inside the URL confuse the ([^)]+) capture group)
  const html = wysiwygMarked.parse("[Bad](javascript:doEvil){.btn-primary}");
  expect(html).toContain('href="#"');
  expect(html).not.toContain("javascript:");
});

// ─── Attributed image extension ──────────────────────────────────────────────

test("attributedImage: renders figure with positional class", () => {
  const html = wysiwygMarked.parse("![alt](/img.jpg){.float-left}");
  expect(html).toContain('<figure class="md-figure float-left">');
  expect(html).toContain('<img src="/img.jpg" alt="alt"');
});

test("attributedImage: decoration classes applied to img", () => {
  const html = wysiwygMarked.parse("![alt](/img.jpg){.mx-auto .border}");
  expect(html).toContain('class="border"');
});

test("attributedImage: unknown classes are filtered out", () => {
  const html = wysiwygMarked.parse("![alt](/img.jpg){.dangerous-class}");
  // dangerous-class is not in the allowed lists, figure still renders but without that class
  expect(html).toContain("<figure");
  expect(html).not.toContain("dangerous-class");
});

// ─── Container directive extension ──────────────────────────────────────────

test("containerDirective: :::center wraps content", () => {
  const html = wysiwygMarked.parse(":::center\nContent\n:::");
  expect(html).toContain('class="md-container md-center"');
  expect(html).toContain("Content");
});

test("containerDirective: :::callout renders aside", () => {
  const html = wysiwygMarked.parse(":::callout\nNote text\n:::");
  expect(html).toContain("<aside");
  expect(html).toContain('class="md-container md-callout"');
});

test("containerDirective: :::callout-warning renders warning aside", () => {
  const html = wysiwygMarked.parse(":::callout-warning\nWarning\n:::");
  expect(html).toContain("md-callout-warning");
});

test("containerDirective: :::divider renders ornamental SVG div", () => {
  const html = wysiwygMarked.parse(":::divider\n:::");
  expect(html).toContain('<div class="md-divider"');
  expect(html).toContain("<svg");
});

test("containerDirective: :::spacer renders spacer div", () => {
  const html = wysiwygMarked.parse(":::spacer\n:::");
  expect(html).toContain('<div class="md-spacer"');
});

test("containerDirective: :::columns-2 renders column layout", () => {
  const html = wysiwygMarked.parse(":::columns-2\nLeft\n---\nRight\n:::");
  expect(html).toContain("md-columns");
  expect(html).toContain("md-column");
});

test("containerDirective: disallowed directive name is not rendered as directive", () => {
  const html = wysiwygMarked.parse(":::injected-div\ncontent\n:::");
  expect(html).not.toContain('class="md-container"');
});

// ─── Bullet point extension ──────────────────────────────────────────────────

test("bulletPoint: [+] renders checkmark bullet", () => {
  const html = wysiwygMarked.parse("[+] Checkmark item");
  expect(html).toContain('class="md-bullet md-bullet-check"');
  expect(html).toContain("Checkmark item");
});

test("bulletPoint: [-] renders X bullet", () => {
  const html = wysiwygMarked.parse("[-] Cross item");
  expect(html).toContain('class="md-bullet md-bullet-x"');
  expect(html).toContain("Cross item");
});

// ─── Tooltip extension ───────────────────────────────────────────────────────

test("tooltip: ^[text](tip) renders tooltip span", () => {
  const html = wysiwygMarked.parse("^[visible text](Tooltip content here)");
  expect(html).toContain('class="md-tooltip"');
  expect(html).toContain('data-tooltip="Tooltip content here"');
  expect(html).toContain("visible text");
});

test("tooltip: tooltip content is HTML-escaped", () => {
  const html = wysiwygMarked.parse('^[text](Content with "quotes")');
  expect(html).toContain("&quot;");
  expect(html).not.toContain('data-tooltip="Content with "quotes"');
});

// ─── Relation embed extension ─────────────────────────────────────────────────

test("relationEmbed: [ref:type:id] renders placeholder div", () => {
  const html = wysiwygMarked.parse("[ref:bullet-list:42]\n");
  expect(html).toContain('data-md-rel="bullet-list"');
  expect(html).toContain('data-md-rel-id="42"');
});

// ─── extractRelationRefs ──────────────────────────────────────────────────────

test("extractRelationRefs returns empty array for empty string", () => {
  expect(extractRelationRefs("")).toEqual([]);
});

test("extractRelationRefs finds a single ref", () => {
  const refs = extractRelationRefs("Some text [ref:bullet-list:5] more text");
  expect(refs).toEqual([{ type: "bullet-list", id: 5 }]);
});

test("extractRelationRefs finds multiple distinct refs", () => {
  const refs = extractRelationRefs("[ref:bullet-list:1]\n[ref:gallery:2]");
  expect(refs).toContainEqual({ type: "bullet-list", id: 1 });
  expect(refs).toContainEqual({ type: "gallery", id: 2 });
});

test("extractRelationRefs deduplicates identical refs", () => {
  const refs = extractRelationRefs("[ref:bullet-list:1] [ref:bullet-list:1]");
  expect(refs).toHaveLength(1);
});

test("extractRelationRefs parses id as integer", () => {
  const refs = extractRelationRefs("[ref:bullet-list:007]");
  expect(refs[0].id).toBe(7);
  expect(typeof refs[0].id).toBe("number");
});

// ─── parseWithRelations ───────────────────────────────────────────────────────

test("parseWithRelations replaces relation placeholder with provided HTML", () => {
  const markdown = "[ref:bullet-list:42]\n";
  const relations = { "bullet-list:42": "<ul><li>Item</li></ul>" };
  const html = parseWithRelations(markdown, relations);
  expect(html).toContain("<ul><li>Item</li></ul>");
  expect(html).not.toContain("data-md-rel");
});

test("parseWithRelations leaves placeholder empty when relation not provided", () => {
  const markdown = "[ref:bullet-list:99]\n";
  const html = parseWithRelations(markdown, {});
  expect(html).not.toContain("data-md-rel");
  // placeholder replaced with empty string
  expect(html.trim()).toBe("");
});

test("parseWithRelations with no relations argument works", () => {
  const markdown = "[ref:bullet-list:1]\n";
  const html = parseWithRelations(markdown);
  expect(html).not.toContain("data-md-rel");
});

test("parseWithRelations preserves non-embed content", () => {
  const markdown = "# Heading\n\n[ref:bullet-list:1]\n\nParagraph text.";
  const html = parseWithRelations(markdown, { "bullet-list:1": "<ul></ul>" });
  expect(html).toContain("<h1");
  expect(html).toContain("Paragraph text");
  expect(html).toContain("<ul></ul>");
});
