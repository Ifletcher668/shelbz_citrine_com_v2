/**
 * Heritage-only toolbar groups.
 * Standard markdown buttons (Bold, Italic, Headings, etc.) live directly in Toolbar.jsx.
 */
export const HERITAGE_GROUPS = [
  {
    label: 'Formatting',
    buttons: [
      { id: 'highlight', label: '==', title: 'Highlight', action: 'wrap', before: '==', after: '==' },
    ],
  },
  {
    label: 'Colors',
    buttons: [
      { id: 'color-pale-gold',    label: '', title: 'Pale Gold',    color: '#b4aa96', action: 'wrap', before: '{color:pale-gold}',    after: '{/color}' },
      { id: 'color-silver-white', label: '', title: 'Silver White', color: '#d8d3cc', action: 'wrap', before: '{color:silver-white}', after: '{/color}' },
      { id: 'color-frost-blue',   label: '', title: 'Frost Blue',   color: '#b8c5d6', action: 'wrap', before: '{color:frost-blue}',   after: '{/color}' },
      { id: 'color-deep-crimson', label: '', title: 'Deep Crimson', color: '#8b2020', action: 'wrap', before: '{color:deep-crimson}', after: '{/color}' },
      { id: 'color-moss-green',   label: '', title: 'Moss Green',   color: '#4a6b4d', action: 'wrap', before: '{color:moss-green}',   after: '{/color}' },
      { id: 'color-fog',          label: '', title: 'Fog',          color: '#7a7a8a', action: 'wrap', before: '{color:fog}',          after: '{/color}' },
      { id: 'color-stone-grey',   label: '', title: 'Stone Grey',   color: '#8c8273', action: 'wrap', before: '{color:stone-grey}',   after: '{/color}' },
    ],
  },
  {
    label: 'Buttons',
    buttons: [
      { id: 'btn-primary',   label: 'Btn 1°', title: 'Primary Button',   action: 'block', template: '[${selection}](/url){.btn-primary}' },
      { id: 'btn-secondary', label: 'Btn 2°', title: 'Secondary Button', action: 'block', template: '[${selection}](/url){.btn-secondary}' },
    ],
  },
  {
    label: 'Layout',
    buttons: [
      { id: 'center',     label: 'Center', title: 'Center Block', action: 'block', template: ':::center\n${selection}\n:::' },
      { id: 'right',      label: 'Right',  title: 'Right Align',  action: 'block', template: ':::right\n${selection}\n:::' },
      { id: 'columns-2',  label: '2 Col',  title: '2 Columns',    action: 'block', template: ':::columns-2\nLeft\n---\nRight\n:::' },
      { id: 'columns-3',  label: '3 Col',  title: '3 Columns',    action: 'block', template: ':::columns-3\nCol 1\n---\nCol 2\n---\nCol 3\n:::' },
    ],
  },
  {
    label: 'Blocks',
    buttons: [
      { id: 'drop-cap',        label: 'Drop Cap', title: 'Drop Cap',        action: 'block', template: ':::drop-cap\n${selection}\n:::' },
      { id: 'prose',           label: 'Prose',    title: 'Prose',           action: 'block', template: ':::prose\n${selection}\n:::' },
      { id: 'callout',         label: 'Callout',  title: 'Callout',         action: 'block', template: ':::callout\n${selection}\n:::' },
      { id: 'callout-warning', label: '⚠ Warn',  title: 'Callout Warning', action: 'block', template: ':::callout-warning\n${selection}\n:::' },
      { id: 'callout-info',    label: 'ℹ Info',  title: 'Callout Info',    action: 'block', template: ':::callout-info\n${selection}\n:::' },
    ],
  },
  {
    label: 'Decorative',
    buttons: [
      { id: 'divider',   label: 'Divider',   title: 'Ornamental Divider', action: 'block', template: ':::divider\n:::' },
      { id: 'spacer',    label: 'Spacer',    title: 'Spacer',             action: 'block', template: ':::spacer\n:::' },
      { id: 'spacer-sm', label: 'Spacer SM', title: 'Small Spacer',       action: 'block', template: ':::spacer-sm\n:::' },
      { id: 'spacer-lg', label: 'Spacer LG', title: 'Large Spacer',       action: 'block', template: ':::spacer-lg\n:::' },
    ],
  },
];
