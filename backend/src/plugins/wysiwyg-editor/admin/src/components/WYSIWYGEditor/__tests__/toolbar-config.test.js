import { WYSIWYG_GROUPS } from "../toolbar-config";
import { SEMANTIC_COLOR_NAMES } from "../../../hooks/color-slots";

describe("WYSIWYG_GROUPS structure", () => {
  test("exports an array with 7 groups", () => {
    expect(Array.isArray(WYSIWYG_GROUPS)).toBe(true);
    expect(WYSIWYG_GROUPS).toHaveLength(7);
  });

  test("group labels are Structure, Alignment, Columns, Formatting, Button, Block, Decorative", () => {
    const labels = WYSIWYG_GROUPS.map((g) => g.label);
    expect(labels).toEqual([
      "Structure",
      "Alignment",
      "Columns",
      "Formatting",
      "Button",
      "Block",
      "Decorative",
    ]);
  });

  test("every group has a label and non-empty buttons array", () => {
    for (const group of WYSIWYG_GROUPS) {
      expect(typeof group.label).toBe("string");
      expect(group.label.length).toBeGreaterThan(0);
      expect(Array.isArray(group.buttons)).toBe(true);
      expect(group.buttons.length).toBeGreaterThan(0);
    }
  });

  test("every button has id, title, and action", () => {
    for (const group of WYSIWYG_GROUPS) {
      for (const btn of group.buttons) {
        expect(typeof btn.id).toBe("string");
        expect(btn.id.length).toBeGreaterThan(0);
        expect(typeof btn.title).toBe("string");
        expect(btn.title.length).toBeGreaterThan(0);
        expect(typeof btn.action).toBe("string");
      }
    }
  });

  test("wrap buttons have before and after strings", () => {
    const wrapButtons = WYSIWYG_GROUPS.flatMap((g) =>
      g.buttons.filter((b) => b.action === "wrap"),
    );
    expect(wrapButtons.length).toBeGreaterThan(0);
    for (const btn of wrapButtons) {
      expect(typeof btn.before).toBe("string");
      expect(typeof btn.after).toBe("string");
    }
  });

  test("block buttons have a template string", () => {
    const blockButtons = WYSIWYG_GROUPS.flatMap((g) =>
      g.buttons.filter((b) => b.action === "block"),
    );
    expect(blockButtons.length).toBeGreaterThan(0);
    for (const btn of blockButtons) {
      expect(typeof btn.template).toBe("string");
      expect(btn.template.length).toBeGreaterThan(0);
    }
  });

  test("no duplicate button IDs across all groups", () => {
    const ids = WYSIWYG_GROUPS.flatMap((g) => g.buttons.map((b) => b.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("no Colors group — colors are now dynamic via useThemeColors()", () => {
    const colorsGroup = WYSIWYG_GROUPS.find((g) => g.label === "Colors");
    expect(colorsGroup).toBeUndefined();
  });

  test("Formatting group contains line-break button", () => {
    const formattingGroup = WYSIWYG_GROUPS.find((g) => g.label === "Formatting");
    expect(formattingGroup).toBeDefined();
    const ids = formattingGroup.buttons.map((b) => b.id);
    expect(ids).toContain("line-break");
  });

  test("Structure group is a dropdown and contains container buttons", () => {
    const structureGroup = WYSIWYG_GROUPS.find((g) => g.label === "Structure");
    expect(structureGroup).toBeDefined();
    expect(structureGroup.dropdown).toBe(true);

    const ids = structureGroup.buttons.map((b) => b.id);
    expect(ids).toContain("container-narrow");
    expect(ids).toContain("container-reading");
    expect(ids).toContain("container-wide");
    expect(ids).toContain("container-full");
  });

  test("Alignment group is a dropdown and contains center and right buttons", () => {
    const alignmentGroup = WYSIWYG_GROUPS.find((g) => g.label === "Alignment");
    expect(alignmentGroup).toBeDefined();
    expect(alignmentGroup.dropdown).toBe(true);

    const ids = alignmentGroup.buttons.map((b) => b.id);
    expect(ids).toContain("align-center");
    expect(ids).toContain("align-right");
  });

  test("Columns group is a dropdown and contains column buttons", () => {
    const columnsGroup = WYSIWYG_GROUPS.find((g) => g.label === "Columns");
    expect(columnsGroup).toBeDefined();
    expect(columnsGroup.dropdown).toBe(true);

    const ids = columnsGroup.buttons.map((b) => b.id);
    expect(ids).toContain("columns-2");
    expect(ids).toContain("columns-5");
  });

  test("all button actions are known action types", () => {
    const KNOWN_ACTIONS = new Set(["wrap", "block"]);
    for (const group of WYSIWYG_GROUPS) {
      for (const btn of group.buttons) {
        expect(KNOWN_ACTIONS.has(btn.action)).toBe(true);
      }
    }
  });
});

describe("SEMANTIC_COLOR_NAMES", () => {
  test("exports an array of semantic color name strings", () => {
    expect(Array.isArray(SEMANTIC_COLOR_NAMES)).toBe(true);
    expect(SEMANTIC_COLOR_NAMES.length).toBeGreaterThan(0);
    for (const name of SEMANTIC_COLOR_NAMES) {
      expect(typeof name).toBe("string");
    }
  });

  test("includes expected semantic color names", () => {
    expect(SEMANTIC_COLOR_NAMES).toContain("accent");
    expect(SEMANTIC_COLOR_NAMES).toContain("text-muted");
    expect(SEMANTIC_COLOR_NAMES).toContain("text-heading");
    expect(SEMANTIC_COLOR_NAMES).toContain("info");
    expect(SEMANTIC_COLOR_NAMES).toContain("danger");
    expect(SEMANTIC_COLOR_NAMES).toContain("success");
  });

  test("does not include legacy aesthetic color names", () => {
    expect(SEMANTIC_COLOR_NAMES).not.toContain("pale-gold");
    expect(SEMANTIC_COLOR_NAMES).not.toContain("stone-grey");
    expect(SEMANTIC_COLOR_NAMES).not.toContain("frost-blue");
  });
});
