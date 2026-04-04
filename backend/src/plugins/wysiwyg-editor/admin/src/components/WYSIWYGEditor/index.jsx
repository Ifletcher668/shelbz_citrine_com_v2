import React, { useState, useRef, useEffect, useCallback } from "react";
import { Flex, Box, Field, Button, Typography } from "@strapi/design-system";
import { useStrapiApp } from "@strapi/admin/strapi-admin";
import { Collapse, Expand } from "@strapi/icons";
import { styled, createGlobalStyle } from "styled-components";
import CodeMirror from "codemirror5";
import "codemirror5/lib/codemirror.css";
import "codemirror5/addon/display/placeholder";
import "codemirror5/mode/markdown/markdown";
import "codemirror5/addon/search/searchcursor";
import "codemirror5/addon/edit/matchbrackets";
import "codemirror5/keymap/sublime";
import Toolbar from "./Toolbar";
import Preview from "./Preview";
import { insertFile, markdownHandler, wysiwygWrap } from "./editor-handlers";
import CommandPalette from "./CommandPalette";
import { COMMANDS } from "./command-registry";

// ── Styled components ──────────────────────────────────────────────────────────

// When the editor is expanded, Radix UI popper portals (used by SingleSelect)
// render in document.body with z-index:auto which loses to our z-index:9999 overlay.
// This global style lifts them above the overlay only while expanded.
const ExpandedPopperStyles = createGlobalStyle`
  [data-radix-popper-content-wrapper] {
    z-index: 10000 !important;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.neutral800};
  opacity: 0.5;
  z-index: 9998;
`;

// Mirrors Strapi's WysiwygStyles.mjs ExpandButton exactly
const ExpandButton = styled(Button)`
  background-color: transparent;
  border: none;
  align-items: center;

  & > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-weight: ${({ theme }) => theme.fontWeights.regular};
  }

  svg {
    margin-left: ${({ theme }) => `${theme.spaces[2]}`};

    path {
      fill: ${({ theme }) => theme.colors.neutral700};
      width: 1.2rem;
      height: 1.2rem;
    }
  }
`;

// Mirrors Strapi's EditorStylesContainer — all CodeMirror overrides via theme tokens
const EditorStylesContainer = styled.div`
  flex: 1;
  overflow: hidden;
  min-height: ${({ $isExpanded }) => ($isExpanded ? "0" : "410px")};
  border-right: ${({ $splitView, theme }) =>
    $splitView ? `1px solid ${theme.colors.neutral200}` : "none"};

  .CodeMirror {
    background: ${({ theme }) => theme.colors.neutral0};
    color: ${({ theme }) => theme.colors.neutral800};
    font-family: "IBM Plex Mono", "Courier New", monospace;
    font-size: 13px;
    line-height: 1.65;
    height: ${({ $isExpanded }) => ($isExpanded ? "100%" : "410px")};
    border: none;
    border-radius: 0;
    direction: ltr;
  }

  .CodeMirror-scroll {
    height: ${({ $isExpanded }) => ($isExpanded ? "100%" : "410px")};
    min-height: ${({ $isExpanded }) => ($isExpanded ? "unset" : "410px")};
  }

  .CodeMirror-lines {
    padding: ${({ theme }) => `${theme.spaces[3]} ${theme.spaces[4]}`};
  }

  .CodeMirror-placeholder {
    color: ${({ theme }) => theme.colors.neutral600} !important;
  }

  .CodeMirror-cursor {
    border-left: 1px solid ${({ theme }) => theme.colors.neutral800};
    border-right: none;
    width: 0;
  }

  .CodeMirror-selected {
    background: ${({ theme }) => theme.colors.neutral200};
  }

  .CodeMirror-scrollbar-filler,
  .CodeMirror-gutter-filler {
    background-color: ${({ theme }) => theme.colors.neutral0};
  }

  span {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────

const WYSIWYGEditor = React.forwardRef(
  (
    {
      name,
      value = "",
      onChange,
      disabled,
      required,
      error,
      hint,
      label,
      labelAction,
    },
    _ref,
  ) => {
    const textareaRef = useRef(null);
    const editorRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const nameRef = useRef(name);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    // viewMode controls the expanded split-view state:
    // "editor" = full editor only, "split" = side-by-side, "preview" = full preview
    const [viewMode, setViewMode] = useState("editor");
    const [paletteOpen, setPaletteOpen] = useState(false);
    const slashPosRef = useRef(null); // set when palette is opened via '/' trigger

    const components = useStrapiApp(
      "WYSIWYGEditorMediaLib",
      (state) => state.components,
    );
    const MediaLibraryDialog = components["media-library"];

    // Keep refs current so the CodeMirror change handler never goes stale
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    useEffect(() => {
      nameRef.current = name;
    }, [name]);

    // ── Initialize CodeMirror once on mount ───────────────────────────────────
    useEffect(() => {
      if (!textareaRef.current) return;
      if (editorRef.current) editorRef.current.toTextArea();

      const cm = CodeMirror.fromTextArea(textareaRef.current, {
        mode: "markdown",
        lineWrapping: true,
        extraKeys: {
          Tab: false,
          "Shift-Tab": false,
          // Formatting shortcuts (Obsidian-style)
          "Cmd-B": (editor) => markdownHandler({ current: editor }, "Bold"),
          "Cmd-I": (editor) => markdownHandler({ current: editor }, "Italic"),
          "Cmd-K": (editor) => markdownHandler({ current: editor }, "Link"),
          "Cmd-Shift-H": (editor) =>
            wysiwygWrap({ current: editor }, "==", "=="),
          // Line moving (Alt+Up/Down, like Obsidian)
          "Alt-Up": "swapLineUp",
          "Alt-Down": "swapLineDown",
          // Command palette
          "Cmd-P": () => {
            slashPosRef.current = null;
            setPaletteOpen(true);
          },
          // Multi-cursor (Sublime-style)
          "Cmd-D": "selectNextOccurrence",
          "Ctrl-Shift-Up": "addCursorToPrevLine",
          "Ctrl-Shift-Down": "addCursorToNextLine",
        },
        readOnly: false,
        smartIndent: false,
        placeholder: "Write markdown\u2026",
        spellcheck: true,
        inputStyle: "contenteditable",
      });

      cm.setValue(value || "");

      cm.on("change", (doc) => {
        onChangeRef.current({
          target: {
            name: nameRef.current,
            value: doc.getValue(),
            type: "text",
          },
        });
      });

      editorRef.current = cm;

      cm.on("inputRead", (editor, change) => {
        if (change.text[0] !== "/") return;
        const cursor = editor.getCursor();
        const lineContent = editor.getLine(cursor.line);
        const beforeSlash = lineContent.slice(0, cursor.ch - 1).trim();
        if (beforeSlash !== "") return;
        // '/' at start of line — open palette and track slash position for cleanup
        slashPosRef.current = { line: cursor.line, ch: cursor.ch - 1 };
        setPaletteOpen(true);
      });

      return () => {
        if (editorRef.current) {
          editorRef.current.toTextArea();
          editorRef.current = null;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty — only run on mount

    // ── Sync external value changes (e.g. form reset) ─────────────────────────
    useEffect(() => {
      const cm = editorRef.current;
      if (cm && !cm.hasFocus()) {
        const next = value || "";
        if (cm.getValue() !== next) cm.setValue(next);
      }
    }, [value]);

    // ── Sync disabled state ───────────────────────────────────────────────────
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.setOption("readOnly", disabled ? "nocursor" : false);
      }
    }, [disabled]);

    // ── Refresh CodeMirror layout when view or expand state changes ───────────
    useEffect(() => {
      const effectivePreview = isExpanded
        ? viewMode === "preview"
        : isPreviewMode;
      if (editorRef.current && !effectivePreview) {
        setTimeout(() => editorRef.current?.refresh(), 50);
      }
    }, [isPreviewMode, isExpanded, viewMode]);

    // ── Expand / collapse ─────────────────────────────────────────────────────
    const handleExpand = useCallback(() => setIsExpanded(true), []);
    const handleCollapse = useCallback(() => {
      setIsExpanded(false);
      setViewMode("editor");
    }, []);

    const closePalette = useCallback(() => {
      setPaletteOpen(false);
      editorRef.current?.focus();
    }, []);

    const handlePaletteExecute = useCallback((cmd) => {
      const cm = editorRef.current;
      if (!cm) return;
      if (slashPosRef.current) {
        const { line, ch } = slashPosRef.current;
        cm.replaceRange("", { line, ch }, { line, ch: ch + 1 });
        slashPosRef.current = null;
      }
      cmd.action(cm);
      cm.focus();
    }, []);

    // ── Preview mode toggle (non-expanded) ────────────────────────────────────
    const handleTogglePreviewMode = useCallback(
      () => setIsPreviewMode((v) => !v),
      [],
    );

    // ── View mode cycling (expanded) ──────────────────────────────────────────
    const handleCycleViewMode = useCallback(() => {
      setViewMode((current) => {
        if (current === "editor") return "split";
        if (current === "split") return "preview";
        return "editor";
      });
    }, []);

    // ── Media library ─────────────────────────────────────────────────────────
    const handleToggleMediaLib = useCallback(
      () => setMediaLibVisible((v) => !v),
      [],
    );

    const handleSelectAssets = useCallback((files) => {
      const formatted = files.map((f) => ({
        alt: f.alternativeText || f.name,
        url: f.url,
        mime: f.mime,
      }));
      insertFile(editorRef, formatted);
      setMediaLibVisible(false);
    }, []);

    // In expanded mode, viewMode drives visibility; otherwise isPreviewMode does
    const showEditor = isExpanded ? viewMode !== "preview" : !isPreviewMode;
    const showPreview = isExpanded ? viewMode !== "editor" : isPreviewMode;

    const expandedContainerStyle = isExpanded
      ? {
          position: "fixed",
          top: "5dvh",
          left: "5dvw",
          width: "90dvw",
          height: "90dvh",
          zIndex: 9999,
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }
      : {};

    return (
      <Field.Root
        name={name}
        id={name}
        error={error}
        hint={hint}
        required={required}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label}</Field.Label>

          {/* Lift Radix popper portals above the overlay when expanded */}
          {isExpanded && <ExpandedPopperStyles />}

          {/* Backdrop when expanded — click to collapse */}
          {isExpanded && <Backdrop onClick={handleCollapse} />}

          {/* Outer border — matches Strapi's EditorLayout normal-mode Flex */}
          <Flex
            direction="column"
            alignItems="stretch"
            background={isExpanded ? "neutral0" : undefined}
            borderColor={error ? "danger600" : "neutral200"}
            borderStyle="solid"
            borderWidth="1px"
            hasRadius
            style={expandedContainerStyle}
          >
            <Toolbar
              editorRef={editorRef}
              disabled={disabled}
              isExpanded={isExpanded}
              isPreviewMode={isPreviewMode}
              viewMode={viewMode}
              onTogglePreviewMode={handleTogglePreviewMode}
              onCycleViewMode={handleCycleViewMode}
              onToggleMediaLib={handleToggleMediaLib}
            />

            {/* Editor + Preview pane */}
            <Flex
              alignItems="stretch"
              style={{
                minHeight: isExpanded ? 0 : "410px",
                flex: isExpanded ? "1" : "unset",
                overflow: "hidden",
              }}
            >
              {/* CodeMirror host — always mounted, hidden in preview-only mode */}
              <EditorStylesContainer
                $isExpanded={isExpanded}
                $splitView={showEditor && showPreview}
                style={{ display: showEditor ? "block" : "none" }}
              >
                <textarea ref={textareaRef} style={{ display: "none" }} />
              </EditorStylesContainer>

              {showPreview && (
                <Box
                  flex="1"
                  overflow="auto"
                  style={{ minHeight: isExpanded ? 0 : "410px" }}
                >
                  <Preview value={value || ""} />
                </Box>
              )}
            </Flex>

            {/* Footer — mirrors Strapi's WysiwygFooter exactly */}
            <Box
              padding={2}
              background="neutral100"
              style={{ borderRadius: "0 0 4px 4px" }}
            >
              <Flex justifyContent="flex-end" alignItems="center">
                <ExpandButton
                  type="button"
                  variant="tertiary"
                  size="M"
                  onClick={isExpanded ? handleCollapse : handleExpand}
                >
                  <Typography textColor="neutral800">
                    {isExpanded ? "Collapse" : "Expand"}
                  </Typography>
                  {isExpanded ? <Collapse /> : <Expand />}
                </ExpandButton>
              </Flex>
            </Box>
          </Flex>

          <Field.Hint />
          <Field.Error />
        </Flex>

        {/* Strapi's built-in media library dialog */}
        {mediaLibVisible && MediaLibraryDialog && (
          <MediaLibraryDialog
            onClose={handleToggleMediaLib}
            onSelectAssets={handleSelectAssets}
          />
        )}

        <CommandPalette
          isOpen={paletteOpen}
          onClose={closePalette}
          onExecute={handlePaletteExecute}
          commands={COMMANDS}
        />
      </Field.Root>
    );
  },
);

WYSIWYGEditor.displayName = "WYSIWYGEditor";
export default WYSIWYGEditor;
