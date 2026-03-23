/**
 * wysiwyg-only toolbar groups.
 * Standard markdown buttons (Bold, Italic, Headings, etc.) live directly in Toolbar.jsx.
 *
 * Note: The "Colors" group is no longer static. Color swatches are built
 * dynamically in Toolbar.jsx from the active theme via useThemeColors().
 *
 * Row 2 layout:
 *   Structure ▾ | Components ▾ | == ? [-] [+] | [color swatches] | Button ▾ | Block ▾ | Decorative ▾
 */
export const WYSIWYG_GROUPS = [
  /**
   * Structure — container widths, alignment, and multi-column layouts.
   * Merges the old standalone "Container" dropdown + "Layout" dropdown.
   */
  {
    label: "Structure",
    dropdown: true,
    buttons: [
      // Container widths
      {
        id: "container-narrow",
        label: "Narrow",
        title: "Narrow Container",
        action: "block",
        template: ":::container-narrow\n${selection}\n:::",
      },
      {
        id: "container-reading",
        label: "Reading",
        title: "Reading Width Container",
        action: "block",
        template: ":::container-reading\n${selection}\n:::",
      },
      {
        id: "container-wide",
        label: "Wide",
        title: "Wide Container",
        action: "block",
        template: ":::container-wide\n${selection}\n:::",
      },
      {
        id: "container-full",
        label: "Full Width",
        title: "Full Width Container",
        action: "block",
        template: ":::container-full\n${selection}\n:::",
      },
    ],
  },
  {
    label: "Alignment",
    dropdown: true,
    buttons: [
      {
        id: "center",
        label: "Center",
        title: "Center Align",
        action: "block",
        template: ":::center\n${selection}\n:::",
      },
      {
        id: "right",
        label: "Right",
        title: "Right Align",
        action: "block",
        template: ":::right\n${selection}\n:::",
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
        template: ":::columns-2\nLeft\n---\nRight\n:::",
      },
      {
        id: "columns-3",
        label: "3 Columns",
        title: "3 Columns",
        action: "block",
        template: ":::columns-3\nCol 1\n---\nCol 2\n---\nCol 3\n:::",
      },
      {
        id: "columns-4",
        label: "4 Columns",
        title: "4 Columns",
        action: "block",
        template:
          ":::columns-4\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n:::",
      },
      {
        id: "columns-5",
        label: "5 Columns",
        title: "5 Columns",
        action: "block",
        template:
          ":::columns-5\nCol 1\n---\nCol 2\n---\nCol 3\n---\nCol 4\n---\nCol 5\n:::",
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
   * Button — inline CTA button links.
   */
  {
    label: "Button",
    dropdown: true,
    buttons: [
      {
        id: "btn-primary",
        label: "Primary",
        title: "Primary Button",
        action: "block",
        template: "[${selection}](/url){.btn-primary}",
      },
      {
        id: "btn-secondary",
        label: "Secondary",
        title: "Secondary Button",
        action: "block",
        template: "[${selection}](/url){.btn-secondary}",
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
        template: ":::drop-cap\n${selection}\n:::",
      },
      {
        id: "prose",
        label: "Prose",
        title: "Prose",
        action: "block",
        template: ":::prose\n${selection}\n:::",
      },
      {
        id: "callout",
        label: "Callout",
        title: "Callout",
        action: "block",
        template: ":::callout\n${selection}\n:::",
      },
      {
        id: "callout-warning",
        label: "Warning",
        title: "Callout Warning",
        action: "block",
        template: ":::callout-warning\n${selection}\n:::",
      },
      {
        id: "callout-info",
        label: "Info",
        title: "Callout Info",
        action: "block",
        template: ":::callout-info\n${selection}\n:::",
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
        template: ":::divider\n:::",
      },
      {
        id: "spacer",
        label: "Spacer",
        title: "Spacer",
        action: "block",
        template: ":::spacer\n:::",
      },
      {
        id: "spacer-sm",
        label: "Spacer S",
        title: "Small Spacer",
        action: "block",
        template: ":::spacer-sm\n:::",
      },
      {
        id: "spacer-lg",
        label: "Spacer L",
        title: "Large Spacer",
        action: "block",
        template: ":::spacer-lg\n:::",
      },
    ],
  },
];
