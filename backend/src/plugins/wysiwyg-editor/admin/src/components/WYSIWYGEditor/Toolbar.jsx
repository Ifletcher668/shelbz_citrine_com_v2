import React from "react";
import { styled } from "styled-components";
import {
  Box,
  Flex,
  Field,
  Button,
  IconButton,
  IconButtonGroup,
  SingleSelect,
  SingleSelectOption,
} from "@strapi/design-system";
import {
  Bold,
  Italic,
  Underline,
  StrikeThrough,
  BulletList,
  NumberList,
  Code,
  Image,
  Link,
  Quotes,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  HeadingFour,
  HeadingFive,
  HeadingSix,
} from "@strapi/icons";
import { HERITAGE_GROUPS } from "./toolbar-config";
import {
  markdownHandler,
  listHandler,
  titleHandler,
  quoteAndCodeHandler,
  heritageWrap,
  heritageBlock,
} from "./editor-handlers";

// Only custom styled component — no DS equivalent for circular color swatches
const Swatch = styled.button`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  padding: 0;
  background-color: ${({ $color }) => $color};
  border: 2px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 100ms,
    border-color 100ms;

  &:hover:not(:disabled) {
    transform: scale(1.25);
    border-color: rgba(0, 0, 0, 0.4);
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

export default function Toolbar({
  editorRef,
  disabled,
  isPreviewMode,
  onTogglePreviewMode,
  onToggleMediaLib,
}) {
  // disabled OR preview mode = all editing actions blocked
  const isDisabled = disabled || isPreviewMode;

  const guard =
    (fn) =>
    (...args) => {
      if (!editorRef.current || isDisabled) return;
      fn(...args);
    };

  const handleHeading = guard((value) => titleHandler(editorRef, value));

  const handleStd = guard((type) => {
    switch (type) {
      case "Bold":
      case "Italic":
      case "Underline":
      case "Strikethrough":
      case "Link":
        markdownHandler(editorRef, type);
        break;
      case "BulletList":
      case "NumberList":
        listHandler(editorRef, type);
        break;
      case "Code":
      case "Quote":
        quoteAndCodeHandler(editorRef, type);
        break;
      case "Image":
        onToggleMediaLib();
        break;
      default:
        break;
    }
  });

  const handleHeritage = guard((btn) => {
    if (btn.action === "wrap") heritageWrap(editorRef, btn.before, btn.after);
    else if (btn.action === "block") heritageBlock(editorRef, btn.template);
  });

  return (
    <Box>
      {/* ── Row 1: Standard toolbar — mirrors Strapi's WysiwygNav ── */}
      <Flex
        padding={2}
        background="neutral100"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
        borderBottom="1px solid"
        borderColor="neutral200"
        style={{ borderRadius: "4px 4px 0 0" }}
      >
        <Flex gap={2} alignItems="center">
          {/* Headings dropdown */}
          <Field.Root>
            <SingleSelect
              disabled={isDisabled}
              placeholder="Headings"
              aria-label="Headings"
              onChange={handleHeading}
              size="S"
            >
              <SingleSelectOption value="h1" startIcon={<HeadingOne fill="neutral500" />}>
                Heading 1
              </SingleSelectOption>
              <SingleSelectOption value="h2" startIcon={<HeadingTwo fill="neutral500" />}>
                Heading 2
              </SingleSelectOption>
              <SingleSelectOption value="h3" startIcon={<HeadingThree fill="neutral500" />}>
                Heading 3
              </SingleSelectOption>
              <SingleSelectOption value="h4" startIcon={<HeadingFour fill="neutral500" />}>
                Heading 4
              </SingleSelectOption>
              <SingleSelectOption value="h5" startIcon={<HeadingFive fill="neutral500" />}>
                Heading 5
              </SingleSelectOption>
              <SingleSelectOption value="h6" startIcon={<HeadingSix fill="neutral500" />}>
                Heading 6
              </SingleSelectOption>
            </SingleSelect>
          </Field.Root>

          <IconButtonGroup>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Bold")} label="Bold">
              <Bold />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Italic")} label="Italic">
              <Italic />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Underline")} label="Underline">
              <Underline />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Strikethrough")} label="Strikethrough">
              <StrikeThrough />
            </IconButton>
          </IconButtonGroup>

          <IconButtonGroup>
            <IconButton disabled={isDisabled} onClick={() => handleStd("BulletList")} label="Bulleted list">
              <BulletList />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("NumberList")} label="Numbered list">
              <NumberList />
            </IconButton>
          </IconButtonGroup>

          <IconButtonGroup>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Code")} label="Code">
              <Code />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Image")} label="Image">
              <Image />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Link")} label="Link">
              <Link />
            </IconButton>
            <IconButton disabled={isDisabled} onClick={() => handleStd("Quote")} label="Quote">
              <Quotes />
            </IconButton>
          </IconButtonGroup>
        </Flex>

        {/* Preview toggle — mirrors WysiwygPreviewToggleButton */}
        <Button
          type="button"
          variant="tertiary"
          onClick={onTogglePreviewMode}
          disabled={disabled}
        >
          {isPreviewMode ? "Markdown mode" : "Preview mode"}
        </Button>
      </Flex>

      {/* ── Row 2: Heritage-specific toolbar ── */}
      <Flex
        padding={2}
        background="neutral0"
        gap={2}
        alignItems="center"
        borderBottom="1px solid"
        borderColor="neutral200"
        style={{ flexWrap: "wrap" }}
      >
        {HERITAGE_GROUPS.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && (
              <Box
                style={{ width: "1px", height: "20px", flexShrink: 0 }}
                background="neutral200"
              />
            )}
            <Flex gap={1} alignItems="center" style={{ flexWrap: "wrap" }}>
              {group.buttons.map((btn) =>
                btn.color ? (
                  <Swatch
                    key={btn.id}
                    type="button"
                    $color={btn.color}
                    title={btn.title}
                    disabled={isDisabled}
                    onClick={() => handleHeritage(btn)}
                    aria-label={btn.title}
                  />
                ) : (
                  <Button
                    key={btn.id}
                    type="button"
                    title={btn.title}
                    disabled={isDisabled}
                    onClick={() => handleHeritage(btn)}
                    variant="tertiary"
                    size="S"
                  >
                    {btn.label}
                  </Button>
                )
              )}
            </Flex>
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
}
