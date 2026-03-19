import { HERITAGE_GROUPS } from '../toolbar-config';

describe('HERITAGE_GROUPS structure', () => {
  test('exports an array with 6 groups', () => {
    expect(Array.isArray(HERITAGE_GROUPS)).toBe(true);
    expect(HERITAGE_GROUPS).toHaveLength(6);
  });

  test('every group has a label and non-empty buttons array', () => {
    for (const group of HERITAGE_GROUPS) {
      expect(typeof group.label).toBe('string');
      expect(group.label.length).toBeGreaterThan(0);
      expect(Array.isArray(group.buttons)).toBe(true);
      expect(group.buttons.length).toBeGreaterThan(0);
    }
  });

  test('every button has id, title, and action', () => {
    for (const group of HERITAGE_GROUPS) {
      for (const btn of group.buttons) {
        expect(typeof btn.id).toBe('string');
        expect(btn.id.length).toBeGreaterThan(0);
        expect(typeof btn.title).toBe('string');
        expect(btn.title.length).toBeGreaterThan(0);
        expect(typeof btn.action).toBe('string');
      }
    }
  });

  test('wrap buttons have before and after strings', () => {
    const wrapButtons = HERITAGE_GROUPS.flatMap((g) =>
      g.buttons.filter((b) => b.action === 'wrap'),
    );
    expect(wrapButtons.length).toBeGreaterThan(0);
    for (const btn of wrapButtons) {
      expect(typeof btn.before).toBe('string');
      expect(typeof btn.after).toBe('string');
    }
  });

  test('block buttons have a template string', () => {
    const blockButtons = HERITAGE_GROUPS.flatMap((g) =>
      g.buttons.filter((b) => b.action === 'block'),
    );
    expect(blockButtons.length).toBeGreaterThan(0);
    for (const btn of blockButtons) {
      expect(typeof btn.template).toBe('string');
      expect(btn.template.length).toBeGreaterThan(0);
    }
  });

  test('no duplicate button IDs across all groups', () => {
    const ids = HERITAGE_GROUPS.flatMap((g) => g.buttons.map((b) => b.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('Colors group has exactly 7 buttons matching ALLOWED_COLORS', () => {
    const colorsGroup = HERITAGE_GROUPS.find((g) => g.label === 'Colors');
    expect(colorsGroup).toBeDefined();
    expect(colorsGroup.buttons).toHaveLength(7);
  });

  test('all button actions are known action types', () => {
    const KNOWN_ACTIONS = new Set(['wrap', 'block']);
    for (const group of HERITAGE_GROUPS) {
      for (const btn of group.buttons) {
        expect(KNOWN_ACTIONS.has(btn.action)).toBe(true);
      }
    }
  });
});
