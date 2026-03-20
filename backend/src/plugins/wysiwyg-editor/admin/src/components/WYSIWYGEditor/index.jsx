import React, { useState, useRef, useEffect, useCallback } from "react";
import { Flex, Box, Field, Button, Typography } from "@strapi/design-system";
import { useStrapiApp } from "@strapi/admin/strapi-admin";
import { Collapse, Expand } from "@strapi/icons";
import { styled } from "styled-components";
import CodeMirror from "codemirror5";
import "codemirror5/lib/codemirror.css";
import "codemirror5/addon/display/placeholder";
import "codemirror5/mode/markdown/markdown";
import Toolbar from "./Toolbar";
import Preview from "./Preview";
import { insertFile } from "./editor-handlers";

// ── Styled components ──────────────────────────────────────────────────────────

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
        extraKeys: { Tab: false, "Shift-Tab": false },
        readOnly: false,
        smartIndent: false,
        placeholder: "Write wysiwyg markdown\u2026",
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
      if (editorRef.current && !isPreviewMode) {
        setTimeout(() => editorRef.current?.refresh(), 50);
      }
    }, [isPreviewMode, isExpanded]);

    // ── Expand / collapse ─────────────────────────────────────────────────────
    const handleToggleExpand = useCallback(() => setIsExpanded((v) => !v), []);

    // ── Preview mode toggle ───────────────────────────────────────────────────
    const handleTogglePreviewMode = useCallback(
      () => setIsPreviewMode((v) => !v),
      [],
    );

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

    // In expanded mode always show both panes (split — mirrors EditorLayout expanded)
    const showEditor = !isPreviewMode || isExpanded;
    const showPreview = isPreviewMode || isExpanded;

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

          {/* Backdrop when expanded */}
          {isExpanded && <Backdrop onClick={handleToggleExpand} />}

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
              isPreviewMode={isPreviewMode}
              onTogglePreviewMode={handleTogglePreviewMode}
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
                $splitView={showPreview}
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
                  onClick={handleToggleExpand}
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
      </Field.Root>
    );
  },
);

WYSIWYGEditor.displayName = "WYSIWYGEditor";
export default WYSIWYGEditor;
