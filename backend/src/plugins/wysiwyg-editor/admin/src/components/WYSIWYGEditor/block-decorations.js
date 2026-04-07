import { ALLOWED_MD_ATTRS } from "../../utils/marked-extensions";

const OPEN_RE = /^<(md-[\w-]+)((?:\s+data-[\w-]+=["'][^"']*["'])*)\s*>$/;
const CLOSE_RE = /^<\/(md-[\w-]+)\s*>$/;
const SELF_RE = /^<(md-[\w-]+)((?:\s+data-[\w-]+=["'][^"']*["'])*)\s*\/>$/;
const ATTR_RE = /data-([\w-]+)="([^"]*)"/g;

function parseAttrs(str) {
  const attrs = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(str))) attrs[m[1]] = m[2];
  return attrs;
}

function friendlyLabel(tagName, attrs) {
  const base = tagName.replace(/^md-/, "");
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const parts = [cap(base)];
  if (attrs.dir) parts.push(cap(attrs.dir));
  if (attrs.valign) parts.push(`\u2195 ${cap(attrs.valign)}`);
  if (attrs.variant) parts.push(cap(attrs.variant));
  if (attrs.width) parts.push(cap(attrs.width));
  if (attrs.count) parts.push(`\xd7${attrs.count}`);
  if (attrs.size) parts.push(cap(attrs.size));
  return parts.join(": ");
}

function makeWidget(type, label, onEdit, onDelete) {
  const el = document.createElement("span");
  el.className =
    type === "open"
      ? "cm-md-block-open"
      : type === "close"
        ? "cm-md-block-close"
        : "cm-md-block-self";
  el.setAttribute("data-cm-md-deco", "1");

  const lbl = document.createElement("span");
  lbl.className = "cm-md-block-label";
  lbl.textContent =
    type === "close"
      ? `\u25c0 /${label.split(":")[0].trim()}`
      : `\u25b6 ${label}`;
  el.appendChild(lbl);

  if (onEdit) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cm-md-block-btn cm-md-block-edit";
    btn.title = "Edit properties";
    btn.textContent = "\u270e";
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit();
    });
    el.appendChild(btn);
  }

  if (onDelete) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cm-md-block-btn cm-md-block-delete";
    btn.title = "Delete block";
    btn.textContent = "\u2715";
    btn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete();
    });
    el.appendChild(btn);
  }

  return el;
}

function findCloseTag(cm, tagName, openLine) {
  const openStr = `<${tagName}`;
  const closeStr = `</${tagName}`;
  let depth = 1;
  for (let i = openLine + 1; i < cm.lineCount(); i++) {
    const text = cm.getLine(i).trim();
    if (text.startsWith(openStr)) depth++;
    if (text.startsWith(closeStr)) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return null;
}

export function createDecorationScheduler() {
  let timer = null;
  return function schedule(cm, callbacks) {
    clearTimeout(timer);
    timer = setTimeout(() => applyBlockDecorations(cm, callbacks), 150);
  };
}

export function applyBlockDecorations(cm, { onEditRequest } = {}) {
  cm.getAllMarks()
    .filter((m) => m._mdBlockDeco)
    .forEach((m) => m.clear());

  for (let i = 0; i < cm.lineCount(); i++) {
    const raw = cm.getLine(i);
    const text = raw.trim();
    let match;

    if ((match = OPEN_RE.exec(text))) {
      const [, tagName, attrStr] = match;
      const attrs = parseAttrs(attrStr);
      const label = friendlyLabel(tagName, attrs);
      const line = i;

      const onEdit =
        ALLOWED_MD_ATTRS[tagName] && onEditRequest
          ? () => {
              const wrapper = cm.getWrapperElement();
              const el = wrapper.querySelector(
                `[data-cm-md-line="${line}"]`,
              );
              const rect = el ? el.getBoundingClientRect() : null;
              onEditRequest({ tagName, attrs, line, rect });
            }
          : null;

      const onDelete = () => {
        const closeLine = findCloseTag(cm, tagName, line);
        cm.operation(() => {
          if (closeLine !== null) {
            cm.replaceRange(
              "",
              { line: closeLine, ch: 0 },
              { line: closeLine + 1, ch: 0 },
            );
          }
          cm.replaceRange("", { line, ch: 0 }, { line: line + 1, ch: 0 });
        });
      };

      const widget = makeWidget("open", label, onEdit, onDelete);
      widget.setAttribute("data-cm-md-line", String(line));
      const mark = cm.markText(
        { line: i, ch: 0 },
        { line: i, ch: raw.length },
        { replacedWith: widget, atomic: true, handleMouseEvents: true },
      );
      mark._mdBlockDeco = true;
    } else if ((match = CLOSE_RE.exec(text))) {
      const [, tagName] = match;
      const label = friendlyLabel(tagName, {});
      const widget = makeWidget("close", label, null, null);
      const mark = cm.markText(
        { line: i, ch: 0 },
        { line: i, ch: raw.length },
        { replacedWith: widget, atomic: true, handleMouseEvents: true },
      );
      mark._mdBlockDeco = true;
    } else if ((match = SELF_RE.exec(text))) {
      const [, tagName, attrStr] = match;
      const attrs = parseAttrs(attrStr);
      const label = friendlyLabel(tagName, attrs);
      const line = i;

      const onEdit =
        ALLOWED_MD_ATTRS[tagName] && onEditRequest
          ? () => {
              const wrapper = cm.getWrapperElement();
              const el = wrapper.querySelector(
                `[data-cm-md-line="${line}"]`,
              );
              const rect = el ? el.getBoundingClientRect() : null;
              onEditRequest({ tagName, attrs, line, rect });
            }
          : null;

      const onDelete = () => {
        cm.replaceRange("", { line, ch: 0 }, { line: line + 1, ch: 0 });
      };

      const widget = makeWidget("self", label, onEdit, onDelete);
      widget.setAttribute("data-cm-md-line", String(line));
      const mark = cm.markText(
        { line: i, ch: 0 },
        { line: i, ch: raw.length },
        { replacedWith: widget, atomic: true, handleMouseEvents: true },
      );
      mark._mdBlockDeco = true;
    }
  }
}
