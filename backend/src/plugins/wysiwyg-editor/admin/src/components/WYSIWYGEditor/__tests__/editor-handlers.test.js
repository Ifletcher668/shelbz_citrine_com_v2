import { markdownHandler, heritageWrap, heritageBlock } from '../editor-handlers';

// ─── CodeMirror mock factory ──────────────────────────────────────────────────

/**
 * Creates a lightweight fake CodeMirror editor.
 * `selection` — text currently selected (empty string = no selection)
 * `cursorLine/cursorCh` — cursor position returned by getCursor
 */
function makeMockEditor({ selection = '', cursorLine = 0, cursorCh = 0 } = {}) {
  const replaceSelection = jest.fn((text) => {
    // After replaceSelection the cursor moves to the end of the inserted text
    cursorCh += text.length;
  });

  const setSelection = jest.fn();
  const focus = jest.fn();

  const ed = {
    getSelection: jest.fn(() => selection),
    replaceSelection,
    focus,
    getCursor: jest.fn(() => ({ line: cursorLine, ch: cursorCh })),
    setSelection,
    getLine: jest.fn(() => ''),
  };

  return { ed, replaceSelection, setSelection, focus };
}

const makeRef = (ed) => ({ current: ed });

// ─── markdownHandler ──────────────────────────────────────────────────────────

describe('markdownHandler', () => {
  test('Bold with selection wraps text in **', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'word' });
    markdownHandler(makeRef(ed), 'Bold');
    expect(replaceSelection).toHaveBeenCalledWith('**word**');
    expect(ed.focus).toHaveBeenCalled();
  });

  test('Italic with selection wraps text in _', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'phrase' });
    markdownHandler(makeRef(ed), 'Italic');
    expect(replaceSelection).toHaveBeenCalledWith('_phrase_');
  });

  test('Bold with no selection inserts placeholder and sets cursor selection', () => {
    const { ed, replaceSelection, setSelection } = makeMockEditor({ selection: '' });
    markdownHandler(makeRef(ed), 'Bold');
    // First replaceSelection call should insert **Bold**
    expect(replaceSelection).toHaveBeenCalledWith('**Bold**');
    expect(setSelection).toHaveBeenCalled();
  });

  test('Italic with no selection inserts placeholder and sets cursor selection', () => {
    const { ed, replaceSelection, setSelection } = makeMockEditor({ selection: '' });
    markdownHandler(makeRef(ed), 'Italic');
    expect(replaceSelection).toHaveBeenCalledWith('_Italic_');
    expect(setSelection).toHaveBeenCalled();
  });

  test('Strikethrough with selection wraps in ~~', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'text' });
    markdownHandler(makeRef(ed), 'Strikethrough');
    expect(replaceSelection).toHaveBeenCalledWith('~~text~~');
  });

  test('Link with selection wraps in []() syntax', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'my link' });
    markdownHandler(makeRef(ed), 'Link');
    expect(replaceSelection).toHaveBeenCalledWith('[my link](link)');
  });
});

// ─── heritageWrap ─────────────────────────────────────────────────────────────

describe('heritageWrap', () => {
  test('wraps selected text with before/after', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'hello' });
    heritageWrap(makeRef(ed), '==', '==');
    expect(replaceSelection).toHaveBeenCalledWith('==hello==');
    expect(ed.focus).toHaveBeenCalled();
  });

  test('with no selection uses "text" placeholder and sets inner selection', () => {
    const { ed, replaceSelection, setSelection } = makeMockEditor({ selection: '' });
    heritageWrap(makeRef(ed), '{color:pale-gold}', '{/color}');
    expect(replaceSelection).toHaveBeenCalledWith('{color:pale-gold}text{/color}');
    expect(setSelection).toHaveBeenCalled();
  });

  test('with selection does NOT call setSelection', () => {
    const { ed, setSelection } = makeMockEditor({ selection: 'chosen' });
    heritageWrap(makeRef(ed), '==', '==');
    expect(setSelection).not.toHaveBeenCalled();
  });
});

// ─── heritageBlock ────────────────────────────────────────────────────────────

describe('heritageBlock', () => {
  test('replaces ${selection} with selected text', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: 'my content' });
    heritageBlock(makeRef(ed), ':::callout\n${selection}\n:::');
    expect(replaceSelection).toHaveBeenCalledWith(':::callout\nmy content\n:::\n');
  });

  test('replaces ${selection} with "content" when nothing selected', () => {
    const { ed, replaceSelection } = makeMockEditor({ selection: '' });
    heritageBlock(makeRef(ed), ':::center\n${selection}\n:::');
    expect(replaceSelection).toHaveBeenCalledWith(':::center\ncontent\n:::\n');
  });

  test('prepends newline when cursor line has content', () => {
    const ed = {
      getSelection: jest.fn(() => ''),
      replaceSelection: jest.fn(),
      focus: jest.fn(),
      getCursor: jest.fn(() => ({ line: 0 })),
      getLine: jest.fn(() => 'existing text'),
    };
    heritageBlock({ current: ed }, ':::spacer\n:::');
    const inserted = ed.replaceSelection.mock.calls[0][0];
    expect(inserted.startsWith('\n')).toBe(true);
  });

  test('no leading newline when cursor line is empty', () => {
    const ed = {
      getSelection: jest.fn(() => ''),
      replaceSelection: jest.fn(),
      focus: jest.fn(),
      getCursor: jest.fn(() => ({ line: 0 })),
      getLine: jest.fn(() => ''),
    };
    heritageBlock({ current: ed }, ':::divider\n:::');
    const inserted = ed.replaceSelection.mock.calls[0][0];
    expect(inserted.startsWith('\n')).toBe(false);
  });
});
