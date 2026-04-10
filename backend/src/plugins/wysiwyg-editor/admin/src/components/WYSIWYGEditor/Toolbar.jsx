import React, { useState, useEffect, useRef } from "react";
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
import { useFetchClient } from "@strapi/admin/strapi-admin";
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
  CaretDown,
} from "@strapi/icons";
import { WYSIWYG_GROUPS } from "./toolbar-config";
import { RELATION_TYPES } from "./relation-config";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  markdownHandler,
  listHandler,
  titleHandler,
  quoteAndCodeHandler,
  wysiwygWrap,
  wysiwygBlock,
} from "./editor-handlers";

// Build a flat id→button lookup for all groups
const BUTTON_BY_ID = Object.fromEntries(
  WYSIWYG_GROUPS.flatMap((g) => g.buttons.map((b) => [b.id, b])),
);

// Build a label→group lookup for explicit Row 2 ordering
const GROUP_BY_LABEL = Object.fromEntries(
  WYSIWYG_GROUPS.map((g) => [g.label, g]),
);

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

const Divider = () => (
  <Box
    style={{ width: "1px", height: "20px", flexShrink: 0 }}
    background="neutral200"
  />
);

// Labels for the preview button in each view mode (expanded)
const CYCLE_LABELS = {
  editor: "Preview",
  split: "Full Preview",
  preview: "Editor",
};

// Mirrors SingleSelect size="S" from the Strapi DS exactly.
// Values sourced from @strapi/design-system/dist/index.mjs:
//   height → min-height 2.4rem (medium: 2.2rem)
//   padding-block → calc(spaces[2] - 1px) S size (medium: spaces[1])
//   padding-inline → spaces[4] start, spaces[3] end
//   font-size → omega variant: fontSizes[2] = 1.4rem (medium breakpoint)
//   chevron → CaretDown at 1.2rem × 1.2rem, fill neutral500
const ComponentsTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[2]};
  min-height: 2.4rem;
  padding-block: calc(${({ theme }) => theme.spaces[2]} - 1px);
  padding-inline-start: ${({ theme }) => theme.spaces[4]};
  padding-inline-end: ${({ theme }) => theme.spaces[3]};
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral150 : theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes[3]};
  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.neutral500 : theme.colors.neutral600};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 768px) {
    min-height: 2.2rem;
    padding-block: ${({ theme }) => theme.spaces[1]};
    font-size: ${({ theme }) => theme.fontSizes[2]};
  }

  &:hover:not(:disabled) {
    cursor: pointer;
  }
`;

const ComponentsTriggerCaret = styled.span`
  display: flex;
  flex-shrink: 0;
  & > svg {
    width: 1.2rem;
    height: 1.2rem;
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

const ComponentsMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 9999;
  display: flex;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.filterShadow};
`;

const MenuTypeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaces[2]};
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  white-space: nowrap;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary100 : theme.colors.neutral0};

  &:first-child { border-radius: ${({ theme }) => theme.borderRadius} 0 0 0; }
  &:last-child  { border-radius: 0 0 0 ${({ theme }) => theme.borderRadius}; }
`;

const MenuTypeChevron = styled.span`
  color: ${({ theme }) => theme.colors.neutral500};
  font-size: ${({ theme }) => theme.fontSizes[2]};
`;

const MenuInstancePanel = styled.div`
  min-width: 200px;
  max-height: 260px;
  overflow-y: auto;
  border-left: 1px solid ${({ theme }) => theme.colors.neutral150};
`;

const MenuEmptyMsg = styled.div`
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  color: ${({ theme }) => theme.colors.neutral500};
  white-space: nowrap;
  font-style: italic;
`;

const MenuInstanceItem = styled.div`
  padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[4]}`};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  white-space: nowrap;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral800};
  background: ${({ theme }) => theme.colors.neutral0};

  &:hover { background: ${({ theme }) => theme.colors.primary100}; }
  &:first-child { border-radius: 0 ${({ theme }) => theme.borderRadius} 0 0; }
  &:last-child  { border-radius: 0 0 ${({ theme }) => theme.borderRadius} 0; }
`;

/**
 * "Components" flyout menu — click to open, hover a type to reveal its instances.
 * Selecting an instance inserts [ref:type:id] at the cursor.
 */
function ComponentsDropdown({ editorRef, disabled }) {
  const { get } = useFetchClient();
  const [open, setOpen] = useState(false);
  const [hoveredType, setHoveredType] = useState(null);
  const [instancesCache, setInstancesCache] = useState({});
  const containerRef = useRef(null);
  const fetchedRef = useRef(false);

  // Pre-fetch all types the first time the menu opens
  useEffect(() => {
    if (!open || fetchedRef.current) return;
    fetchedRef.current = true;

    Promise.all(
      RELATION_TYPES.map(async (config) => {
        const uid = `api::${config.type}.${config.type}`;
        try {
          const { data } = await get(
            `/content-manager/collection-types/${uid}?fields[0]=id&fields[1]=${config.displayField}&pagination[pageSize]=100&sort=${config.displayField}:asc`,
          );
          return {
            type: config.type,
            items: (data?.results ?? []).map((item) => ({
              value: `${config.type}:${item.id}`,
              label: item[config.displayField] ?? `#${item.id}`,
            })),
          };
        } catch {
          return { type: config.type, items: [] };
        }
      }),
    ).then((results) => {
      const cache = {};
      for (const { type, items } of results) cache[type] = items;
      setInstancesCache(cache);
    });
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
        setHoveredType(null);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function handleInstanceClick(value) {
    const [type, id] = value.split(":");
    const cm = editorRef.current;
    if (!cm || disabled) return;
    cm.replaceSelection(`[ref:${type}:${id}]`);
    cm.focus();
    setOpen(false);
    setHoveredType(null);
  }

  const instances = hoveredType ? instancesCache[hoveredType.type] : undefined;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <ComponentsTrigger
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setHoveredType(null);
        }}
      >
        Components
        <ComponentsTriggerCaret>
          <CaretDown aria-hidden />
        </ComponentsTriggerCaret>
      </ComponentsTrigger>

      {open && (
        <ComponentsMenu>
          {/* Type list — left column */}
          <div>
            {RELATION_TYPES.map((config) => (
              <MenuTypeItem
                key={config.type}
                $active={hoveredType?.type === config.type}
                onMouseEnter={() => setHoveredType(config)}
              >
                {config.label}
                <MenuTypeChevron>›</MenuTypeChevron>
              </MenuTypeItem>
            ))}
          </div>

          {/* Instance list — right column, shown on hover */}
          {hoveredType && instances !== undefined && (
            <MenuInstancePanel>
              {instances.length === 0 ? (
                <MenuEmptyMsg>No components found</MenuEmptyMsg>
              ) : (
                instances.map((opt) => (
                  <MenuInstanceItem
                    key={opt.value}
                    onMouseDown={() => handleInstanceClick(opt.value)}
                  >
                    {opt.label}
                  </MenuInstanceItem>
                ))
              )}
            </MenuInstancePanel>
          )}
        </ComponentsMenu>
      )}
    </div>
  );
}

export default function Toolbar({
  editorRef,
  disabled,
  isExpanded,
  isPreviewMode,
  viewMode,
  onTogglePreviewMode,
  onCycleViewMode,
  onToggleMediaLib,
}) {
  // In expanded mode, editing is blocked only when in full preview
  // In normal mode, editing is blocked in preview mode
  const effectivePreview = isExpanded ? viewMode === "preview" : isPreviewMode;
  const isDisabled = disabled || effectivePreview;

  const themeColors = useThemeColors();

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

  const handleWysiwyg = guard((btn) => {
    if (btn.action === "wrap") wysiwygWrap(editorRef, btn.before, btn.after);
    else if (btn.action === "block") wysiwygBlock(editorRef, btn.template);
  });

  const handleColor = guard(({ name }) => {
    wysiwygWrap(editorRef, `{color:${name}}`, "{/color}");
  });

  // Preview button: cycles view modes in expanded state, toggles in normal state
  const previewLabel = isExpanded
    ? CYCLE_LABELS[viewMode]
    : isPreviewMode
      ? "Markdown mode"
      : "Preview mode";
  const handlePreviewClick = isExpanded ? onCycleViewMode : onTogglePreviewMode;

  // Renders a non-dropdown group (flat buttons)
  const renderFlatGroup = (group) => (
    <Flex gap={1} alignItems="center" style={{ flexWrap: "wrap" }}>
      <IconButtonGroup>
        {group.buttons.map((btn) => (
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
        ))}
      </IconButtonGroup>
    </Flex>
  );

  // Renders a dropdown group
  const renderDropdownGroup = (group) => (
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
  );

  const renderGroup = (group) =>
    group.dropdown ? renderDropdownGroup(group) : renderFlatGroup(group);

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

        {/* Preview toggle — cycles through modes in expanded, toggles in normal */}
        <Button
          type="button"
          variant="tertiary"
          onClick={handlePreviewClick}
          disabled={disabled}
        >
          {previewLabel}
        </Button>
      </Flex>

      {/* ── Row 2: wysiwyg-specific toolbar ────────────────────────────────────
          ─────────────────────────────────────────────────────────────────────── */}
      <Flex
        padding={2}
        background="neutral100"
        gap={2}
        alignItems="center"
        style={{ borderRadius: "4px 4px 0 0", flexWrap: "wrap" }}
      >
        {renderGroup(GROUP_BY_LABEL["Structure"])}
        {renderGroup(GROUP_BY_LABEL["Alignment"])}
        {renderGroup(GROUP_BY_LABEL["Columns"])}

        <Divider />

        {/* Components — embeddable Strapi content type references */}
        <ComponentsDropdown editorRef={editorRef} disabled={isDisabled} />

        <Divider />

        {/* Formatting — highlight, tooltip, bullet types */}
        {renderGroup(GROUP_BY_LABEL["Formatting"])}

        <Divider />

        {/* Color swatches — theme-driven semantic colors */}
        <Flex gap={1} alignItems="center">
          {themeColors.map(({ name, hex }) => (
            <Swatch
              key={name}
              type="button"
              $color={hex}
              title={name}
              disabled={isDisabled}
              onClick={() => handleColor({ name })}
              aria-label={`Color: ${name}`}
            />
          ))}
        </Flex>

        <Divider />

        {/* Block — typographic block styles */}
        {renderGroup(GROUP_BY_LABEL["Block"])}

        <Divider />

        {/* Decorative — ornamental dividers and spacers */}
        {renderGroup(GROUP_BY_LABEL["Decorative"])}
      </Flex>
    </Box>
  );
}
