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
import { WYSIWYG_GROUPS } from "./toolbar-config";
import { RELATION_TYPES } from "./relation-config";
import RelationPickerGroup from "./RelationPickerGroup";

const BUTTON_BY_ID = Object.fromEntries(
  WYSIWYG_GROUPS.flatMap((g) => g.buttons.map((b) => [b.id, b])),
);
import {
  markdownHandler,
  listHandler,
  titleHandler,
  quoteAndCodeHandler,
  wysiwygWrap,
  wysiwygBlock,
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

  const handleContainer = guard((value) => {
    const templates = {
      narrow: ":::container-narrow\n${selection}\n:::",
      reading: ":::container-reading\n${selection}\n:::",
      wide: ":::container-wide\n${selection}\n:::",
      full: ":::container-full\n${selection}\n:::",
    };
    wysiwygBlock(editorRef, templates[value]);
  });

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

  const handleWysiwyg = guard((btn) => {
    if (btn.action === "wrap") wysiwygWrap(editorRef, btn.before, btn.after);
    else if (btn.action === "block") wysiwygBlock(editorRef, btn.template);
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
              <SingleSelectOption
                value="h1"
                startIcon={<HeadingOne fill="neutral500" />}
              >
                Heading 1
              </SingleSelectOption>
              <SingleSelectOption
                value="h2"
                startIcon={<HeadingTwo fill="neutral500" />}
              >
                Heading 2
              </SingleSelectOption>
              <SingleSelectOption
                value="h3"
                startIcon={<HeadingThree fill="neutral500" />}
              >
                Heading 3
              </SingleSelectOption>
              <SingleSelectOption
                value="h4"
                startIcon={<HeadingFour fill="neutral500" />}
              >
                Heading 4
              </SingleSelectOption>
              <SingleSelectOption
                value="h5"
                startIcon={<HeadingFive fill="neutral500" />}
              >
                Heading 5
              </SingleSelectOption>
              <SingleSelectOption
                value="h6"
                startIcon={<HeadingSix fill="neutral500" />}
              >
                Heading 6
              </SingleSelectOption>
            </SingleSelect>
          </Field.Root>

          <IconButtonGroup>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Bold")}
              label="Bold"
            >
              <Bold />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Italic")}
              label="Italic"
            >
              <Italic />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Underline")}
              label="Underline"
            >
              <Underline />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Strikethrough")}
              label="Strikethrough"
            >
              <StrikeThrough />
            </IconButton>
          </IconButtonGroup>

          <IconButtonGroup>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("BulletList")}
              label="Bulleted list"
            >
              <BulletList />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("NumberList")}
              label="Numbered list"
            >
              <NumberList />
            </IconButton>
          </IconButtonGroup>

          <IconButtonGroup>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Code")}
              label="Code"
            >
              <Code />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Image")}
              label="Image"
            >
              <Image />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Link")}
              label="Link"
            >
              <Link />
            </IconButton>
            <IconButton
              disabled={isDisabled}
              onClick={() => handleStd("Quote")}
              label="Quote"
            >
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

      {/* ── Row 2: wysiwyg-specific toolbar ── */}
      <Flex
        padding={2}
        background="neutral100"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
        style={{ borderRadius: "4px 4px 0 0", flexWrap: "wrap" }}
      >
        {/* Container width dropdown */}
        <Field.Root>
          <SingleSelect
            disabled={isDisabled}
            placeholder="Container"
            aria-label="Container width"
            onChange={handleContainer}
            size="S"
          >
            <SingleSelectOption value="narrow">Narrow</SingleSelectOption>
            <SingleSelectOption value="reading">Reading</SingleSelectOption>
            <SingleSelectOption value="wide">Wide</SingleSelectOption>
            <SingleSelectOption value="full">Full</SingleSelectOption>
          </SingleSelect>
        </Field.Root>

        <Box
          style={{ width: "1px", height: "20px", flexShrink: 0 }}
          background="neutral200"
        />

        {/* Embed relation pickers */}
        {RELATION_TYPES.map((config) => (
          <React.Fragment key={config.type}>
            <Box
              style={{ width: "1px", height: "20px", flexShrink: 0 }}
              background="neutral200"
            />
            <RelationPickerGroup
              editorRef={editorRef}
              disabled={isDisabled}
              config={config}
            />
          </React.Fragment>
        ))}

        {WYSIWYG_GROUPS.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && (
              <Box
                style={{ width: "1px", height: "20px", flexShrink: 0 }}
                background="neutral200"
              />
            )}
            {group.dropdown ? (
              <Field.Root>
                <SingleSelect
                  disabled={isDisabled}
                  placeholder={group.label}
                  aria-label={group.label}
                  onChange={(value) => handleWysiwyg(BUTTON_BY_ID[value])}
                  size="S"
                >
                  {group.buttons.map((btn) => (
                    <SingleSelectOption key={btn.id} value={btn.id}>
                      {btn.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Field.Root>
            ) : (
              <Flex gap={1} alignItems="center" style={{ flexWrap: "wrap" }}>
                <IconButtonGroup>
                  {group.buttons.map((btn) =>
                    btn.color ? (
                      <Swatch
                        key={btn.id}
                        type="button"
                        $color={btn.color}
                        title={btn.title}
                        disabled={isDisabled}
                        onClick={() => handleWysiwyg(btn)}
                        aria-label={btn.title}
                      />
                    ) : (
                      <Button
                        key={btn.id}
                        type="button"
                        title={btn.title}
                        disabled={isDisabled}
                        onClick={() => handleWysiwyg(btn)}
                        variant="tertiary"
                        size="S"
                      >
                        {btn.label}
                      </Button>
                    ),
                  )}
                </IconButtonGroup>
              </Flex>
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
}
