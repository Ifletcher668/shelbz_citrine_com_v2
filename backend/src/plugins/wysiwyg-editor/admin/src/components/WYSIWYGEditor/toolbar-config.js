/**
 * wysiwyg-only toolbar groups.
 * Standard markdown buttons (Bold, Italic, Headings, etc.) live directly in Toolbar.jsx.
 *
 * Note: The "Colors" group is no longer static. Color swatches are built
 * dynamically in Toolbar.jsx from the active theme via useThemeColors().
 *
 * Row 2 layout:
 *   Structure ▾ | Alignment ▾ | Columns ▾ | Formatting | [color swatches] | Button ▾ | Block ▾ | Decorative ▾
 *   Image alignment is handled via the media library toolbar button (alignment picker shown after selection).
 */
export const WYSIWYG_GROUPS = [
  /**
   * Structure — container widths.
   */
  {
    label: "Structure",
    dropdown: true,
    buttons: [
      {
        id: "container-narrow",
        label: "Narrow",
        title: "Narrow Container",
        action: "block",
        template: '<md-container data-width="narrow">\n${selection}\n</md-container>',
      },
      {
        id: "container-reading",
        label: "Reading",
        title: "Reading Width Container",
        action: "block",
        template: '<md-container data-width="reading">\n${selection}\n</md-container>',
      },
      {
        id: "container-wide",
        label: "Wide",
        title: "Wide Container",
        action: "block",
        template: '<md-container data-width="wide">\n${selection}\n</md-container>',
      },
      {
        id: "container-full",
        label: "Full Width",
        title: "Full Width Container",
        action: "block",
        template: '<md-container data-width="full">\n${selection}\n</md-container>',
      },
    ],
  },
  /**
   * Alignment — horizontal and vertical text alignment.
   */
  {
    label: "Alignment",
    dropdown: true,
    buttons: [
      {
        id: "align-left",
        label: "Left",
        title: "Align Left",
        action: "block",
        template: '<md-align data-dir="left">\n${selection}\n</md-align>',
      },
      {
        id: "align-center",
        label: "Center",
        title: "Align Center",
        action: "block",
        template: '<md-align data-dir="center">\n${selection}\n</md-align>',
      },
      {
        id: "align-right",
        label: "Right",
        title: "Align Right",
        action: "block",
        template: '<md-align data-dir="right">\n${selection}\n</md-align>',
      },
      {
        id: "align-justify",
        label: "Justify",
        title: "Justify Text",
        action: "block",
        template: '<md-align data-dir="justify">\n${selection}\n</md-align>',
      },
      {
        id: "valign-top",
        label: "Top",
        title: "Vertical Align Top",
        action: "block",
        template: '<md-align data-valign="top">\n${selection}\n</md-align>',
      },
      {
        id: "valign-middle",
        label: "Middle",
        title: "Vertical Align Middle",
        action: "block",
        template: '<md-align data-valign="middle">\n${selection}\n</md-align>',
      },
      {
        id: "valign-bottom",
        label: "Bottom",
        title: "Vertical Align Bottom",
        action: "block",
        template: '<md-align data-valign="bottom">\n${selection}\n</md-align>',
      },
    ],
  },
  {
    label: "Columns",
    dropdown: true,
    buttons: [
      {
        id: "columns-2",
        label: "2 Columns",
        title: "2 Columns",
        action: "block",
        template: '<md-columns data-count="2">\nLeft\n---\nRight\n</md-columns>',
      },
      {
        id: "columns-3",
        label: "3 Columns",
        title: "3 Columns",
        action: "block",
        template: '<md-columns data-count="3">\nCol 1\n---\nCol 2\n---\nCol 3\n</md-columns>',
      },
      {
        id: "columns-4",
        label: "4 Columns",
        title: "4 Columns",
        action: "block",
        template: '<md-columns data-count="4">\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n</md-columns>',
      },
      {
        id: "columns-5",
        label: "5 Columns",
        title: "5 Columns",
        action: "block",
        template: '<md-columns data-count="5">\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n---\nCol 5\n</md-columns>',
      },
    ],
  },
  /**
   * Formatting — inline text decorations.
   */
  {
    label: "Formatting",
    buttons: [
      {
        id: "highlight",
        label: "==",
        title: "Highlight",
        action: "wrap",
        before: "==",
        after: "==",
      },
      {
        id: "tooltip",
        label: "?",
        title: "Tooltip",
        action: "wrap",
        before: "^[",
        after: "](Tooltip text)",
      },
      {
        id: "bullet-x",
        label: "[-]",
        title: "X Bullet",
        action: "block",
        template: "[-] ${selection}",
      },
      {
        id: "bullet-check",
        label: "[+]",
        title: "Check Bullet",
        action: "block",
        template: "[+] ${selection}",
      },
      {
        id: "line-break",
        label: "↵",
        title: "Line Break (<br>)",
        action: "block",
        template: "<br>",
      },
    ],
  },
  /**
   * Block — typographic block styles.
   */
  {
    label: "Block",
    dropdown: true,
    buttons: [
      {
        id: "drop-cap",
        label: "Drop Cap",
        title: "Drop Cap",
        action: "block",
        template: "<md-drop-cap>\n${selection}\n</md-drop-cap>",
      },
      {
        id: "prose",
        label: "Prose",
        title: "Prose",
        action: "block",
        template: "<md-prose>\n${selection}\n</md-prose>",
      },
      {
        id: "callout",
        label: "Callout",
        title: "Callout",
        action: "block",
        template: "<md-callout>\n${selection}\n</md-callout>",
      },
      {
        id: "callout-warning",
        label: "Warning",
        title: "Callout Warning",
        action: "block",
        template: '<md-callout data-variant="warning">\n${selection}\n</md-callout>',
      },
      {
        id: "callout-info",
        label: "Info",
        title: "Callout Info",
        action: "block",
        template: '<md-callout data-variant="info">\n${selection}\n</md-callout>',
      },
    ],
  },
  /**
   * Decorative — ornamental dividers and spacing.
   */
  {
    label: "Decorative",
    dropdown: true,
    buttons: [
      {
        id: "divider",
        label: "Divider",
        title: "Ornamental Divider",
        action: "block",
        template: "<md-divider />",
      },
      {
        id: "spacer",
        label: "Spacer",
        title: "Spacer",
        action: "block",
        template: "<md-spacer />",
      },
      {
        id: "spacer-sm",
        label: "Spacer S",
        title: "Small Spacer",
        action: "block",
        template: '<md-spacer data-size="sm" />',
      },
      {
        id: "spacer-lg",
        label: "Spacer L",
        title: "Large Spacer",
        action: "block",
        template: '<md-spacer data-size="lg" />',
      },
    ],
  },
];
