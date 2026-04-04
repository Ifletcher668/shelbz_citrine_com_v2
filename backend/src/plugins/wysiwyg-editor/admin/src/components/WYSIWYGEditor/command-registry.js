/**
 * command-registry.js
 * Converts WYSIWYG_GROUPS into a flat array of searchable commands.
 * Each command has an action(cm) function that can be called with a raw
 * CodeMirror instance (not a ref).
 */
import { WYSIWYG_GROUPS } from "./toolbar-config";
import { wysiwygBlock, wysiwygWrap } from "./editor-handlers";

function makeAction(button) {
  if (button.action === "wrap") {
    return (cm) => wysiwygWrap({ current: cm }, button.before, button.after);
  }
  return (cm) => wysiwygBlock({ current: cm }, button.template);
}

export const COMMANDS = WYSIWYG_GROUPS.flatMap((group) =>
  group.buttons.map((button) => ({
    id: button.id,
    name: button.title || button.label,
    group: group.label,
    keywords: [button.label, button.id].filter(Boolean),
    action: makeAction(button),
  })),
);
