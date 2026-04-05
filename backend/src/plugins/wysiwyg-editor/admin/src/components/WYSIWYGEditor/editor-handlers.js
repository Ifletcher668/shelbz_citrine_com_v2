/**
 * CodeMirror editor handlers for WYSIWYGEditor.
 * Standard markdown handlers ported from @strapi/content-manager Wysiwyg utils.
 * wysiwyg-specific handlers added below.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

const replaceText = (type, text) => {
  switch (type) {
    case "Strikethrough":
      return `~~${text}~~`;
    case "Bold":
      return `**${text}**`;
    case "Italic":
      return `_${text}_`;
    case "Underline":
      return `<u>${text}</u>`;
    case "Code":
      return `\`\`\`\n${text}\n\`\`\``;
    case "Link":
      return `[${text}](link)`;
    case "Quote":
      return `>${text}`;
    default:
      return text;
  }
};

const buildEmptyInsert = (type) => {
  const n = type;
  switch (type) {
    case "Strikethrough":
      return { text: `~~${n}~~`, sel: { start: n.length, end: 2 } };
    case "Bold":
      return { text: `**${n}**`, sel: { start: n.length, end: 2 } };
    case "Italic":
      return { text: `_${n}_`, sel: { start: n.length, end: 1 } };
    case "Underline":
      return { text: `<u>${n}</u>`, sel: { start: n.length, end: 4 } };
    case "Code":
      return { text: `\`\`\`\n${n}\n\`\`\``, sel: { start: n.length, end: 3 } };
    case "Link":
      return { text: `[${n}](link)`, sel: { start: n.length, end: 7 } };
    case "Quote":
      return { text: `>${n}`, sel: { start: n.length, end: 0 } };
    default:
      return { text: "", sel: { start: 0, end: 0 } };
  }
};

// ─── Standard Handlers (mirrors Strapi's WYSIWYG behaviour) ───────────────────

export const markdownHandler = (editorRef, type) => {
  const ed = editorRef.current;
  const selected = ed.getSelection();
  if (selected) {
    ed.replaceSelection(replaceText(type, selected));
    ed.focus();
  } else {
    const { text, sel } = buildEmptyInsert(type);
    ed.replaceSelection(text);
    ed.focus();
    const { line, ch } = ed.getCursor();
    ed.setSelection(
      { line, ch: ch - sel.end - sel.start },
      { line, ch: ch - sel.end },
    );
  }
};

export const listHandler = (editorRef, listType) => {
  const ed = editorRef.current;
  const doc = ed.getDoc();
  const insertion = listType === "BulletList" ? "- " : "1. ";

  if (doc.somethingSelected()) {
    const selections = doc.listSelections();
    let remove = null;
    ed.operation(() => {
      selections.forEach((selection) => {
        const pos = [selection.head.line, selection.anchor.line].sort(
          (a, b) => a - b,
        );
        const re = /^[*-]\s|^\d+\.\s/;
        if (remove == null) remove = re.test(doc.getLine(pos[0]));
        for (let i = pos[0]; i <= pos[1]; i++) {
          if (remove) {
            if (re.test(doc.getLine(i)))
              doc.replaceRange(
                "",
                { line: i, ch: 0 },
                { line: i, ch: insertion.length },
              );
          } else {
            const ins =
              listType === "BulletList" ? "- " : `${i - pos[0] + 1}. `;
            doc.replaceRange(ins, { line: i, ch: 0 });
          }
        }
      });
    });
  } else {
    const { line } = doc.getCursor();
    const lineContent = ed.getLine(line);
    ed.setSelection({ line, ch: 0 }, { line, ch: lineContent.length });
    ed.replaceSelection(insertion + lineContent);
  }
  ed.focus();
};

export const titleHandler = (editorRef, titleType) => {
  const ed = editorRef.current;
  const map = {
    h1: "# ",
    h2: "## ",
    h3: "### ",
    h4: "#### ",
    h5: "##### ",
    h6: "###### ",
  };
  const prefix = map[titleType] || "";
  const { line } = ed.getCursor();
  const lineContent = ed.getLine(line);
  const clean = lineContent.replace(/#{1,6}\s/g, "").trim();
  ed.setSelection({ line, ch: 0 }, { line, ch: lineContent.length });
  ed.replaceSelection(prefix + clean);
  setTimeout(() => {
    ed.focus();
    ed.setCursor({ line, ch: ed.getLine(line).length });
  }, 0);
};

export const quoteAndCodeHandler = (editorRef, type) => {
  const ed = editorRef.current;
  const selected = ed.getSelection();
  const { line } = ed.getCursor();
  const contentLength = ed.getLine(line).length;
  if (selected) {
    _insertWithSelection(ed, type, line, contentLength, selected);
  } else {
    _insertWithoutSelection(ed, type, line, contentLength);
  }
};

const _insertWithSelection = (ed, type, line, contentLength, selected) => {
  const text = replaceText(type, selected);
  const rest = ed.getRange(
    { line: line + 1, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.replaceRange(
    "",
    { line: line + 1, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.replaceSelection("");
  ed.setCursor({ line, ch: contentLength });
  ed.replaceSelection("\n");
  ed.replaceSelection(text);
  if (type === "Code") {
    const { line: nl } = ed.getCursor();
    ed.setCursor({ line: nl - 1, ch: selected.length });
  }
  ed.replaceRange(
    rest,
    { line: line + 4, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.focus();
};

const _insertWithoutSelection = (ed, type, line, contentLength) => {
  const { text, sel } = buildEmptyInsert(type);
  const rest = ed.getRange(
    { line: line + 1, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.replaceRange(
    "",
    { line: line + 1, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.setCursor({ line, ch: contentLength });
  ed.replaceSelection("\n");
  ed.replaceSelection(text);
  if (type === "Code") {
    line += 2;
    ed.setSelection({ line, ch: 0 }, { line, ch: 4 });
  } else {
    line += 1;
    const { ch } = ed.getCursor();
    ed.setSelection(
      { line, ch: ch - sel.end - sel.start },
      { line, ch: ch - sel.end },
    );
  }
  ed.replaceRange(
    rest,
    { line: line + 2, ch: 0 },
    { line: Infinity, ch: Infinity },
  );
  ed.focus();
};

/** Insert uploaded files into the editor (mirrors Strapi's insertFile).
 *  @param {object} editorRef
 *  @param {Array<{alt: string, url: string, mime: string}>} files
 *  @param {string} [alignClass] — optional CSS class for image alignment (e.g. "mx-auto", "float-left")
 */
export const insertFile = (editorRef, files, alignClass) => {
  const ed = editorRef.current;
  let { line } = ed.getCursor();
  const { ch } = ed.getCursor();
  files.forEach((file, i) => {
    let len = ed.getLine(line).length;
    ed.setCursor({ line, ch: len });
    if (i > 0 || (i === 0 && ch !== 0)) {
      len = ed.getLine(line).length;
      ed.setCursor({ line, ch: len });
      line++;
      ed.replaceSelection("\n");
    }
    if (file.mime.includes("image")) {
      const suffix = alignClass ? `{.${alignClass}}` : "";
      ed.replaceSelection(`![${file.alt}](${file.url})${suffix}`);
    } else {
      ed.replaceSelection(`[${file.alt}](${file.url})`);
    }
  });
  setTimeout(() => ed.focus(), 0);
};

// ─── wysiwyg-specific handlers ───────────────────────────────────────────────

/** Wraps selection (or placeholder) with before/after syntax. */
export const wysiwygWrap = (editorRef, before, after) => {
  const ed = editorRef.current;
  const selected = ed.getSelection();
  ed.replaceSelection(before + (selected || "text") + after);
  if (!selected) {
    const { line, ch } = ed.getCursor();
    ed.setSelection(
      { line, ch: ch - after.length - "text".length },
      { line, ch: ch - after.length },
    );
  }
  ed.focus();
};

/** Inserts a block template, replacing ${selection} with any selected text. */
export const wysiwygBlock = (editorRef, template) => {
  const ed = editorRef.current;
  const selected = ed.getSelection();
  const insert = template.replace("${selection}", selected || "content");
  const { line } = ed.getCursor();
  const lineContent = ed.getLine(line);
  const prefix = lineContent.trim() ? "\n" : "";
  ed.replaceSelection(prefix + insert + "\n");
  ed.focus();
};
