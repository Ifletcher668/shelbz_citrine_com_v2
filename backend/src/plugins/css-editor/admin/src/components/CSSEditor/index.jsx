import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Box, Flex, Field, Button } from "@strapi/design-system";
import { Collapse, Expand } from "@strapi/icons";
import { styled, createGlobalStyle } from "styled-components";
import CodeMirror from "codemirror5";
import "codemirror5/lib/codemirror.css";
import "codemirror5/mode/css/css";
import "codemirror5/addon/edit/closebrackets";
import "codemirror5/addon/edit/matchbrackets";
import "codemirror5/addon/hint/show-hint";
import "codemirror5/addon/hint/show-hint.css";
import "codemirror5/addon/hint/css-hint";

// ── Styles ─────────────────────────────────────────────────────────────────────

const ExpandedOverlayStyles = createGlobalStyle`
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
    margin-left: ${({ theme }) => theme.spaces[2]};

    path {
      fill: ${({ theme }) => theme.colors.neutral700};
      width: 1.2rem;
      height: 1.2rem;
    }
  }
`;

const EditorContainer = styled.div`
  position: ${({ $isExpanded }) => ($isExpanded ? "fixed" : "relative")};
  inset: ${({ $isExpanded }) => ($isExpanded ? "2.5rem" : "auto")};
  z-index: ${({ $isExpanded }) => ($isExpanded ? "9999" : "auto")};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger600 : theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;

  .CodeMirror {
    background: ${({ theme }) => theme.colors.neutral0};
    color: ${({ theme }) => theme.colors.neutral800};
    font-family: "IBM Plex Mono", "Courier New", monospace;
    font-size: 13px;
    line-height: 1.65;
    height: ${({ $isExpanded }) => ($isExpanded ? "calc(100% - 2.5rem)" : "300px")};
    border: none;
    border-radius: 0;
  }

  .CodeMirror-scroll {
    min-height: ${({ $isExpanded }) => ($isExpanded ? "0" : "300px")};
  }

  .CodeMirror-gutters {
    background: ${({ theme }) => theme.colors.neutral100};
    border-right: 1px solid ${({ theme }) => theme.colors.neutral200};
  }

  .CodeMirror-linenumber {
    color: ${({ theme }) => theme.colors.neutral400};
    font-size: 12px;
  }

  .CodeMirror-cursor {
    border-left-color: ${({ theme }) => theme.colors.neutral800};
  }

  .CodeMirror-selected {
    background: ${({ theme }) => theme.colors.primary100};
  }

  .CodeMirror-matchingbracket {
    color: ${({ theme }) => theme.colors.primary600} !important;
    font-weight: bold;
    text-decoration: underline;
  }

  .cm-s-default .cm-keyword { color: #a626a4; }
  .cm-s-default .cm-atom    { color: #986801; }
  .cm-s-default .cm-number  { color: #986801; }
  .cm-s-default .cm-string  { color: #50a14f; }
  .cm-s-default .cm-comment { color: #a0a1a7; font-style: italic; }
  .cm-s-default .cm-property { color: #4078f2; }
  .cm-s-default .cm-tag     { color: #e45649; }
  .cm-s-default .cm-variable { color: #383a42; }
  .cm-s-default .cm-variable-2 { color: #c18401; }
  .cm-s-default .cm-builtin { color: #0184bc; }
  .cm-s-default .cm-operator { color: #383a42; }

  .CodeMirror-hints {
    font-family: "IBM Plex Mono", monospace;
    font-size: 12px;
    z-index: 10001;
  }
`;

const Toolbar = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: ${({ theme }) => theme.colors.neutral100};
  padding: ${({ theme }) => `${theme.spaces[1]} ${theme.spaces[2]}`};
  min-height: 2.5rem;
`;

const PLACEHOLDER = `/* Custom CSS for this component */
.my-section {
  color: var(--color-accent);
  margin-top: var(--spacing-4);
}`;

// ── Component ──────────────────────────────────────────────────────────────────

const CSSEditor = forwardRef(function CSSEditor(
  {
    name,
    value = "",
    onChange,
    disabled = false,
    required = false,
    error,
    hint,
    label,
    labelAction,
  },
  ref
) {
  const textareaRef = useRef(null);
  const cmRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasError = Boolean(error);

  // Mount CodeMirror once
  useEffect(() => {
    if (!textareaRef.current || cmRef.current) return;

    const cm = CodeMirror.fromTextArea(textareaRef.current, {
      mode: "css",
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      readOnly: disabled ? "nocursor" : false,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
      hintOptions: {
        completeSingle: false,
      },
      placeholder: PLACEHOLDER,
    });

    cm.setValue(value || "");

    cm.on("change", (instance) => {
      onChange({ target: { name, value: instance.getValue(), type: "text" } });
    });

    cmRef.current = cm;

    return () => {
      if (cmRef.current) {
        cmRef.current.toTextArea();
        cmRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value from outside (e.g. form reset, programmatic updates)
  useEffect(() => {
    if (!cmRef.current) return;
    const currentVal = cmRef.current.getValue();
    if (currentVal !== (value || "")) {
      cmRef.current.setValue(value || "");
    }
  }, [value]);

  // Sync disabled state
  useEffect(() => {
    if (!cmRef.current) return;
    cmRef.current.setOption("readOnly", disabled ? "nocursor" : false);
  }, [disabled]);

  // Refresh CodeMirror when expand state changes (layout reflow)
  useEffect(() => {
    if (!cmRef.current) return;
    setTimeout(() => cmRef.current.refresh(), 10);
  }, [isExpanded]);

  return (
    <>
      {isExpanded && <Backdrop />}
      {isExpanded && <ExpandedOverlayStyles />}

      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          {label && (
            <Flex gap={1}>
              <Field.Label action={labelAction}>{label}</Field.Label>
            </Flex>
          )}

          <EditorContainer $isExpanded={isExpanded} $hasError={hasError}>
            <Toolbar justifyContent="flex-end" alignItems="center">
              <ExpandButton
                variant="ghost"
                size="S"
                onClick={() => setIsExpanded((v) => !v)}
                disabled={disabled}
                title={isExpanded ? "Collapse editor" : "Expand editor"}
              >
                {isExpanded ? <Collapse /> : <Expand />}
                {isExpanded ? "Collapse" : "Expand"}
              </ExpandButton>
            </Toolbar>

            <Box ref={ref}>
              <textarea ref={textareaRef} style={{ display: "none" }} />
            </Box>
          </EditorContainer>

          <Field.Error />
          <Field.Hint />
        </Flex>
      </Field.Root>
    </>
  );
});

export default CSSEditor;
