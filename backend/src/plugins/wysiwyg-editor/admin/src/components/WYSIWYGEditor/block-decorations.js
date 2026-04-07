import { ALLOWED_MD_ATTRS } from "../../utils/marked-extensions";
import { RELATION_TYPES } from "./relation-config";

const OPEN_RE = /^<(md-[\w-]+)((?:\s+data-[\w-]+=["'][^"']*["'])*)\s*>$/;
const CLOSE_RE = /^<\/(md-[\w-]+)\s*>$/;
const SELF_RE = /^<(md-[\w-]+)((?:\s+data-[\w-]+=["'][^"']*["'])*)\s*\/>$/;
const ATTR_RE = /data-([\w-]+)="([^"]*)"/g;
const REF_RE = /\[ref:([\w-]+):(\d+)\]/g;

const RELATION_TYPE_LABEL = Object.fromEntries(
  RELATION_TYPES.map((r) => [r.type, r.label])
);

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

function showCopiedTooltip(btn) {
  btn.querySelector(".cm-md-copy-tooltip")?.remove();
  const tip = document.createElement("span");
  tip.className = "cm-md-copy-tooltip";
  tip.textContent = "Copied!";
  btn.appendChild(tip);
  setTimeout(() => tip.remove(), 1400);
}

/**
 * Inline widget for [ref:type:id] relation embeds.
 */
function makeRefWidget(rawToken, label, onEdit, onDelete, onCursorTo) {
  const el = document.createElement("span");
  el.className = "cm-md-ref-widget";
  el.setAttribute("data-cm-md-deco", "1");

  // ── Drag handle ───────────────────────────────────────────────────────────
  const handle = document.createElement("span");
  handle.className = "cm-md-block-handle";
  handle.textContent = "\u28ff"; // ⠿
  handle.title = "Drag to move";
  el.appendChild(handle);

  // ── Label ─────────────────────────────────────────────────────────────────
  const lbl = document.createElement("span");
  lbl.className = "cm-md-ref-label";
  lbl.textContent = label;
  lbl.title = "Click to toggle raw";
  lbl.style.cursor = "text";

  let showingRaw = false;
  lbl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showingRaw = !showingRaw;
    lbl.textContent = showingRaw ? rawToken : label;
    if (!showingRaw && onCursorTo) onCursorTo();
  });
  el.appendChild(lbl);

  // ── Edit button ───────────────────────────────────────────────────────────
  if (onEdit) {
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "cm-md-block-btn cm-md-block-edit";
    editBtn.title = "Change component";
    editBtn.textContent = "\u270e"; // ✎
    editBtn.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit(el.getBoundingClientRect());
    });
    el.appendChild(editBtn);
  }

  // ── Delete button ─────────────────────────────────────────────────────────
  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "cm-md-block-btn cm-md-block-delete";
  delBtn.title = "Remove";
  delBtn.textContent = "\u2715";
  delBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  });
  el.appendChild(delBtn);

  return el;
}

/**
 * Move a single line from fromLine to toLine (insert before toLine).
 */
function moveLine(cm, fromLine, toLine) {
  if (fromLine === toLine) return;
  const content = cm.getLine(fromLine);
  cm.operation(() => {
    cm.replaceRange("", { line: fromLine, ch: 0 }, { line: fromLine + 1, ch: 0 });
    const dest = fromLine < toLine ? toLine - 1 : toLine;
    cm.replaceRange(content + "\n", { line: dest, ch: 0 });
  });
}

// ── Mouse-based line drag ─────────────────────────────────────────────────────
// HTML5 DnD fights CodeMirror's internal event handling and doesn't reliably
// fire dragstart. Raw mousedown/mousemove/mouseup avoids the conflict.

function startLineDrag(cm, fromLine, startEvent) {
  const rawText = cm.getLine(fromLine).trim();

  // Floating preview that follows the cursor
  const preview = document.createElement("div");
  Object.assign(preview.style, {
    position: "fixed",
    pointerEvents: "none",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: "4px",
    fontSize: "11px",
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    fontWeight: "600",
    padding: "2px 10px",
    color: "#4338ca",
    whiteSpace: "nowrap",
    zIndex: "99999",
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    left: (startEvent.clientX + 14) + "px",
    top: (startEvent.clientY - 10) + "px",
  });
  preview.textContent = rawText;
  document.body.appendChild(preview);

  // Horizontal line showing insertion point
  const indicator = document.createElement("div");
  Object.assign(indicator.style, {
    position: "fixed",
    pointerEvents: "none",
    height: "2px",
    background: "#4945ff",
    zIndex: "99998",
    display: "none",
  });
  document.body.appendChild(indicator);

  let targetLine = null;

  function onMouseMove(e) {
    preview.style.left = (e.clientX + 14) + "px";
    preview.style.top = (e.clientY - 10) + "px";

    const wrapper = cm.getWrapperElement();
    const r = wrapper.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top && e.clientY <= r.bottom;

    if (inside) {
      const pos = cm.coordsChar({ left: e.clientX, top: e.clientY }, "window");
      targetLine = pos.line;
      const lineCoords = cm.charCoords({ line: targetLine, ch: 0 }, "window");
      indicator.style.display = "block";
      indicator.style.top = lineCoords.top + "px";
      indicator.style.left = r.left + "px";
      indicator.style.width = r.width + "px";
    } else {
      targetLine = null;
      indicator.style.display = "none";
    }
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    preview.remove();
    indicator.remove();
    if (targetLine !== null && targetLine !== fromLine) {
      moveLine(cm, fromLine, targetLine);
    }
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  onMouseMove(startEvent);
}

/**
 * Wire the handle inside a widget up to the line-drag system.
 */
function addDragBehavior(widget, cm, line) {
  const handle = widget.querySelector(".cm-md-block-handle");
  if (!handle) return;

  handle.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    startLineDrag(cm, line, e);
  });
}

/**
 * @param {"open"|"close"|"self"} type
 * @param {string} label       - friendly label (e.g. "Align: Center")
 * @param {string} rawText     - raw markdown tag (e.g. `<md-align data-dir="center">`)
 * @param {Function|null} onEdit
 * @param {Function|null} onDelete
 * @param {Function|null} onCursorTo - places cursor on this line when label is clicked
 */
function makeWidget(type, label, rawText, onEdit, onDelete, onCursorTo) {
  const el = document.createElement("span");
  el.className =
    type === "open"
      ? "cm-md-block-open"
      : type === "close"
        ? "cm-md-block-close"
        : "cm-md-block-self";
  el.setAttribute("data-cm-md-deco", "1");

  // ── Drag handle ───────────────────────────────────────────────────────────
  const handle = document.createElement("span");
  handle.className = "cm-md-block-handle";
  handle.textContent = "\u28ff"; // ⠿
  handle.title = "Drag to move";
  el.appendChild(handle);

  // ── Label (▶ / ◀ — click to toggle raw / place cursor) ───────────────────
  const friendlyText =
    type === "close"
      ? `\u25c0 /${label.split(":")[0].trim()}`
      : `\u25b6 ${label}`;

  const lbl = document.createElement("span");
  lbl.className = "cm-md-block-label";
  lbl.textContent = friendlyText;
  lbl.style.cursor = "text";
  lbl.title = "Click to toggle raw";

  let showingRaw = false;
  lbl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showingRaw = !showingRaw;
    lbl.textContent = showingRaw ? rawText : friendlyText;
    if (onCursorTo) onCursorTo();
  });
  el.appendChild(lbl);

  // ── Edit button ───────────────────────────────────────────────────────────
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

  // ── Copy button ───────────────────────────────────────────────────────────
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "cm-md-block-btn cm-md-block-copy";
  copyBtn.title = "Copy tag";
  copyBtn.textContent = "\u29c9";
  copyBtn.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(rawText).then(() => showCopiedTooltip(copyBtn));
  });
  el.appendChild(copyBtn);

  // ── Delete button ─────────────────────────────────────────────────────────
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

export function applyBlockDecorations(cm, { onEditRequest, onRefEditRequest, relations = {} } = {}) {
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
              const el = wrapper.querySelector(`[data-cm-md-line="${line}"]`);
              const rect = el ? el.getBoundingClientRect() : null;
              onEditRequest({ tagName, attrs, line, rect });
            }
          : null;

      const onDelete = () => {
        const closeLine = findCloseTag(cm, tagName, line);
        cm.operation(() => {
          if (closeLine !== null) {
            cm.replaceRange("", { line: closeLine, ch: 0 }, { line: closeLine + 1, ch: 0 });
          }
          cm.replaceRange("", { line, ch: 0 }, { line: line + 1, ch: 0 });
        });
      };

      const onCursorTo = () => { cm.setCursor({ line, ch: 0 }); cm.focus(); };

      const widget = makeWidget("open", label, raw.trim(), onEdit, onDelete, onCursorTo);
      widget.setAttribute("data-cm-md-line", String(line));
      addDragBehavior(widget, cm, line);

      const mark = cm.markText(
        { line: i, ch: 0 },
        { line: i, ch: raw.length },
        { replacedWith: widget, atomic: true, handleMouseEvents: true },
      );
      mark._mdBlockDeco = true;

    } else if ((match = CLOSE_RE.exec(text))) {
      const [, tagName] = match;
      const label = friendlyLabel(tagName, {});
      const line = i;
      const onCursorTo = () => { cm.setCursor({ line, ch: 0 }); cm.focus(); };

      const widget = makeWidget("close", label, raw.trim(), null, null, onCursorTo);
      addDragBehavior(widget, cm, line);

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
              const el = wrapper.querySelector(`[data-cm-md-line="${line}"]`);
              const rect = el ? el.getBoundingClientRect() : null;
              onEditRequest({ tagName, attrs, line, rect });
            }
          : null;

      const onDelete = () => {
        cm.replaceRange("", { line, ch: 0 }, { line: line + 1, ch: 0 });
      };

      const onCursorTo = () => { cm.setCursor({ line, ch: 0 }); cm.focus(); };

      const widget = makeWidget("self", label, raw.trim(), onEdit, onDelete, onCursorTo);
      widget.setAttribute("data-cm-md-line", String(line));
      addDragBehavior(widget, cm, line);

      const mark = cm.markText(
        { line: i, ch: 0 },
        { line: i, ch: raw.length },
        { replacedWith: widget, atomic: true, handleMouseEvents: true },
      );
      mark._mdBlockDeco = true;

    } else {
      // Inline [ref:type:id] tokens
      REF_RE.lastIndex = 0;
      let refMatch;
      while ((refMatch = REF_RE.exec(raw)) !== null) {
        const [fullToken, type, id] = refMatch;
        const key = `${type}:${id}`;
        const typeName = RELATION_TYPE_LABEL[type] ?? type;
        const title = relations[key] ?? "\u2026";
        const label = `\u25b6 ${typeName}: ${title}`;
        const chStart = refMatch.index;
        const chEnd = chStart + fullToken.length;
        const line = i;

        const onDelete = () => {
          cm.replaceRange("", { line, ch: chStart }, { line, ch: chEnd });
        };
        const onCursorTo = () => { cm.setCursor({ line, ch: chStart }); cm.focus(); };
        const onEdit = onRefEditRequest
          ? (rect) => onRefEditRequest({ type, id: parseInt(id, 10), line, chStart, chEnd, rect })
          : null;

        const widget = makeRefWidget(fullToken, label, onEdit, onDelete, onCursorTo);
        addDragBehavior(widget, cm, line);
        const mark = cm.markText(
          { line: i, ch: chStart },
          { line: i, ch: chEnd },
          { replacedWith: widget, atomic: true, handleMouseEvents: true },
        );
        mark._mdBlockDeco = true;
      }
    }
  }
}
