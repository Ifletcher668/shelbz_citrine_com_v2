import { wysiwygMarked } from "../marked-extensions";

// Trim trailing newline that marked always appends to block output
const parse = (md) => wysiwygMarked.parse(md).trim();

// ─── highlightExtension ───────────────────────────────────────────────────────

describe("highlightExtension", () => {
  test("==text== renders <mark>", () => {
    expect(parse("==hello==")).toContain(
      '<mark class="md-highlight">hello</mark>',
    );
  });

  test("single = inside is not treated as highlight", () => {
    const html = parse("a=b");
    expect(html).not.toContain("<mark");
    expect(html).toContain("a=b");
  });

  test("adjacent highlights both render", () => {
    const html = parse("==foo====bar==");
    expect(html).toContain('<mark class="md-highlight">foo</mark>');
    expect(html).toContain('<mark class="md-highlight">bar</mark>');
  });

  test("highlight with spaces inside", () => {
    expect(parse("==some text here==")).toContain(
      '<mark class="md-highlight">some text here</mark>',
    );
  });

  test("unclosed == does not produce <mark>", () => {
    const html = parse("==unclosed");
    expect(html).not.toContain("<mark");
  });
});

// ─── coloredTextExtension ─────────────────────────────────────────────────────

describe("coloredTextExtension", () => {
  const COLORS = [
    "pale-gold",
    "silver-white",
    "frost-blue",
    "deep-crimson",
    "moss-green",
    "fog",
    "stone-grey",
  ];

  test.each(COLORS)("%s produces correct span style", (color) => {
    const html = parse(`{color:${color}}hello{/color}`);
    expect(html).toContain(`style="color:var(--color-${color})"`);
    expect(html).toContain("hello");
  });

  test("disallowed color passes through as raw text", () => {
    const html = parse("{color:red}danger{/color}");
    expect(html).not.toContain("<span style=");
    expect(html).toContain("{color:red}");
  });

  test("color spans wrap the text content", () => {
    const html = parse("{color:fog}misty words{/color}");
    expect(html).toContain(
      '<span style="color:var(--color-fog)">misty words</span>',
    );
  });
});

// ─── buttonLinkExtension ──────────────────────────────────────────────────────

describe("buttonLinkExtension", () => {
  test("btn-primary produces correct class", () => {
    const html = parse("[Click me](/page){.btn-primary}");
    expect(html).toContain('class="btn-primary"');
    expect(html).toContain('href="/page"');
    expect(html).toContain("Click me");
  });

  test("btn-secondary produces correct class", () => {
    const html = parse("[Learn more](/about){.btn-secondary}");
    expect(html).toContain('class="btn-secondary"');
  });

  test(".lg adds btn-lg class", () => {
    const html = parse("[Big](/x){.btn-primary .lg}");
    expect(html).toContain("btn-lg");
  });

  test(".sm adds btn-sm class", () => {
    const html = parse("[Small](/x){.btn-primary .sm}");
    expect(html).toContain("btn-sm");
  });

  test("icon=arrow-right injects SVG and md-btn-icon class", () => {
    const html = parse("[Go](/x){.btn-primary icon=arrow-right}");
    expect(html).toContain("md-btn-icon");
    expect(html).toContain("<svg");
  });

  test('target=_blank adds rel="noopener noreferrer"', () => {
    const html = parse("[Link](/x){.btn-primary target=_blank}");
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  test("javascript: href is sanitized to #", () => {
    // Use a URL without parens so ([^)]+) in the tokenizer regex can match it
    const html = parse("[Xss](javascript:xss){.btn-primary}");
    expect(html).toContain('href="#"');
    expect(html).not.toContain("javascript:");
  });

  test("non-button link attrs fall through to standard link", () => {
    const html = parse("[plain](/url){.not-a-btn}");
    // Should not render as a buttonLink — marked renders it as a plain link
    expect(html).not.toContain('class="not-a-btn"');
  });
});

// ─── attributedImageExtension ─────────────────────────────────────────────────

describe("attributedImageExtension", () => {
  test("positional classes applied to <figure>", () => {
    const html = parse("![alt](/img.jpg){.float-left .w-1/3}");
    expect(html).toContain('class="md-figure float-left w-1/3"');
    expect(html).toContain("<figure");
  });

  test("decoration class applied to <img>", () => {
    const html = parse("![alt](/img.jpg){.mx-auto .border}");
    expect(html).toContain('class="border"');
    expect(html).toContain("<img");
  });

  test("unknown class is filtered from both figure and img", () => {
    const html = parse("![alt](/img.jpg){.unknown-class}");
    expect(html).not.toContain("unknown-class");
  });

  test("alt text is preserved", () => {
    const html = parse("![my photo](/img.jpg){.mx-auto}");
    expect(html).toContain('alt="my photo"');
  });

  test("javascript: src is sanitized to #", () => {
    // Use a URL without parens so ([^)]+) in the tokenizer regex can match it
    const html = parse("![x](javascript:xss){.mx-auto}");
    expect(html).toContain('src="#"');
    expect(html).not.toContain("javascript:");
  });

  test("no decoration classes omits class attr on img", () => {
    const html = parse("![alt](/img.jpg){.float-right}");
    // img should not have a class attr since no decoration classes
    const imgMatch = html.match(/<img[^>]+>/);
    expect(imgMatch).not.toBeNull();
    expect(imgMatch[0]).not.toContain("class=");
  });
});

// ─── containerDirectiveExtension ─────────────────────────────────────────────

describe("containerDirectiveExtension", () => {
  describe("alignment", () => {
    test(":::center wraps in md-center", () => {
      const html = parse(":::center\nhello\n:::");
      expect(html).toContain('class="md-container md-center"');
      expect(html).toContain("hello");
    });

    test(":::right wraps in md-right", () => {
      const html = parse(":::right\nhello\n:::");
      expect(html).toContain('class="md-container md-right"');
    });
  });

  describe("callouts", () => {
    test(":::callout renders <aside> with md-callout", () => {
      const html = parse(":::callout\nNote!\n:::");
      expect(html).toContain('<aside class="md-container md-callout">');
      expect(html).toContain("Note!");
    });

    test(":::callout-warning renders md-callout-warning", () => {
      const html = parse(":::callout-warning\nWatch out\n:::");
      expect(html).toContain("md-callout-warning");
    });

    test(":::callout-info renders md-callout-info", () => {
      const html = parse(":::callout-info\nFYI\n:::");
      expect(html).toContain("md-callout-info");
    });
  });

  describe("columns", () => {
    test(":::columns-2 splits on --- and creates 2 md-column divs", () => {
      const html = parse(":::columns-2\nLeft\n---\nRight\n:::");
      expect(html).toContain("md-columns md-columns-2");
      expect(html.match(/class="md-column"/g)).toHaveLength(2);
    });

    test(":::columns-3 splits on --- and creates 3 md-column divs", () => {
      const html = parse(":::columns-3\nA\n---\nB\n---\nC\n:::");
      expect(html).toContain("md-columns md-columns-3");
      expect(html.match(/class="md-column"/g)).toHaveLength(3);
    });

    test("--- column separator is not parsed as <hr>", () => {
      const html = parse(":::columns-2\nLeft\n---\nRight\n:::");
      expect(html).not.toContain("<hr");
    });
  });

  describe("drop-cap and text", () => {
    test(":::drop-cap renders drop-cap class", () => {
      const html = parse(":::drop-cap\nFirst paragraph.\n:::");
      expect(html).toContain('class="md-container drop-cap"');
    });

    test(":::text renders prose-heritage class", () => {
      const html = parse(":::text\nSome text.\n:::");
      expect(html).toContain('class="md-container prose-heritage"');
    });
  });

  describe("self-closing directives", () => {
    test(":::divider renders ornamental SVG", () => {
      const html = parse(":::divider\n:::");
      expect(html).toContain('class="md-divider"');
      expect(html).toContain("<svg");
    });

    test(":::spacer renders md-spacer", () => {
      const html = parse(":::spacer\n:::");
      expect(html).toContain('class="md-spacer"');
      expect(html).not.toContain("<svg");
    });

    test(":::spacer-sm renders md-spacer-sm", () => {
      const html = parse(":::spacer-sm\n:::");
      expect(html).toContain('class="md-spacer-sm"');
    });

    test(":::spacer-lg renders md-spacer-lg", () => {
      const html = parse(":::spacer-lg\n:::");
      expect(html).toContain('class="md-spacer-lg"');
    });
  });

  describe("unknown directive", () => {
    test("unknown directive is rejected and not rendered as container", () => {
      const html = parse(":::unknown-thing\nhello\n:::");
      expect(html).not.toContain("md-container");
    });
  });
});

// ─── tooltipExtension ─────────────────────────────────────────────────────────

describe("tooltipExtension", () => {
  test("^[text](tip) renders md-tooltip span with data-tooltip", () => {
    const html = parse("^[visible text](tooltip content)");
    expect(html).toContain('class="md-tooltip"');
    expect(html).toContain('data-tooltip="tooltip content"');
    expect(html).toContain("visible text");
  });

  test("renders the help circle SVG icon", () => {
    const html = parse("^[text](tip)");
    expect(html).toContain("<svg");
    expect(html).toContain("<circle");
  });

  test("tooltip text is trimmed of surrounding whitespace", () => {
    const html = parse("^[text](  tip with spaces  )");
    expect(html).toContain('data-tooltip="tip with spaces"');
  });

  test("tooltip text with double quotes is escaped", () => {
    const html = parse('^[text](say "hello")');
    expect(html).toContain('data-tooltip="say &quot;hello&quot;"');
    expect(html).not.toContain('data-tooltip="say "hello""');
  });

  test("unclosed syntax does not produce md-tooltip", () => {
    const html = parse("^[text](unclosed");
    expect(html).not.toContain("md-tooltip");
  });

  test("missing closing bracket does not produce md-tooltip", () => {
    const html = parse("^[text(tip)");
    expect(html).not.toContain("md-tooltip");
  });
});

// ─── card directives ──────────────────────────────────────────────────────────

describe("card directives", () => {
  test(":::card-dark renders md-card md-card-dark", () => {
    const html = parse(":::card-dark\nContent\n:::");
    expect(html).toContain('class="md-card md-card-dark"');
    expect(html).toContain("Content");
  });

  test(":::card-gold renders md-card md-card-gold", () => {
    const html = parse(":::card-gold\nContent\n:::");
    expect(html).toContain('class="md-card md-card-gold"');
  });

  test(":::card-steel renders md-card md-card-steel", () => {
    const html = parse(":::card-steel\nContent\n:::");
    expect(html).toContain('class="md-card md-card-steel"');
  });

  test("card renders inner block content", () => {
    const html = parse(":::card-gold\n## Title\n\nParagraph\n:::");
    expect(html).toContain("<h2");
    expect(html).toContain("Title");
    expect(html).toContain("Paragraph");
  });
});

// ─── bulletPointExtension ─────────────────────────────────────────────────────

describe("bulletPointExtension", () => {
  test("[-] renders md-bullet-x with X SVG", () => {
    const html = parse("[-] Some problem");
    expect(html).toContain('class="md-bullet md-bullet-x"');
    expect(html).toContain("md-bullet-icon");
    expect(html).toContain("<svg");
    expect(html).toContain("Some problem");
  });

  test("[+] renders md-bullet-check with check SVG", () => {
    const html = parse("[+] Some solution");
    expect(html).toContain('class="md-bullet md-bullet-check"');
    expect(html).toContain("md-bullet-icon");
    expect(html).toContain("<svg");
    expect(html).toContain("Some solution");
  });

  test("multiple bullets each render independently", () => {
    const html = parse("[-] First\n[+] Second");
    expect(html).toContain("md-bullet-x");
    expect(html).toContain("md-bullet-check");
    expect(html).toContain("First");
    expect(html).toContain("Second");
  });

  test("bullets inside card-dark render within the card", () => {
    const html = parse(":::card-dark\n[-] Problem item\n:::");
    expect(html).toContain("md-card-dark");
    expect(html).toContain("md-bullet-x");
    expect(html).toContain("Problem item");
  });

  test("bullets inside card-gold render within the card", () => {
    const html = parse(":::card-gold\n[+] Solution item\n:::");
    expect(html).toContain("md-card-gold");
    expect(html).toContain("md-bullet-check");
    expect(html).toContain("Solution item");
  });
});

// ─── relationEmbedExtension ───────────────────────────────────────────────────

describe("relationEmbedExtension", () => {
  test("[ref:bullet-list:42] renders placeholder with type and id", () => {
    const html = parse("[ref:bullet-list:42]");
    expect(html).toContain("bullet-list #42");
    expect(html).toContain("md-embed-ref");
  });

  test("[ref:unknown-type:1] still renders placeholder (admin shows all refs)", () => {
    const html = parse("[ref:unknown-type:1]");
    expect(html).toContain("unknown-type #1");
  });

  test("ref embed does not render as a link", () => {
    const html = parse("[ref:bullet-list:7]");
    expect(html).not.toContain("<a ");
  });

  test("inline text before/after embed is preserved", () => {
    const html = parse("Before\n\n[ref:bullet-list:1]\n\nAfter");
    expect(html).toContain("Before");
    expect(html).toContain("bullet-list #1");
    expect(html).toContain("After");
  });
});

// ─── combined ─────────────────────────────────────────────────────────────────

describe("combined extensions", () => {
  test("highlight inside callout renders both", () => {
    const html = parse(":::callout\n==important==\n:::");
    expect(html).toContain("md-callout");
    expect(html).toContain('<mark class="md-highlight">important</mark>');
  });

  test("colored text inside center block renders both", () => {
    const html = parse(":::center\n{color:pale-gold}golden{/color}\n:::");
    expect(html).toContain("md-center");
    expect(html).toContain("color:var(--color-pale-gold)");
  });

  test("nested directives: :::center inside :::container-full", () => {
    const md = ":::container-full\n:::center\n# Heading\n:::\n:::";
    const html = parse(md);
    expect(html).toContain("md-constrain-full");
    expect(html).toContain("md-center");
    expect(html).toContain("<h1");
  });
});
