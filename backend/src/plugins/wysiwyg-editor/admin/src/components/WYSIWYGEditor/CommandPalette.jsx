import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@strapi/design-system";
import { styled } from "styled-components";

// ── Styled components ──────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15dvh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PaletteBox = styled.div`
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 8px;
  width: min(560px, 90dvw);
  max-height: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral500};
  }
`;

const ResultsList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const GroupHeader = styled.div`
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.neutral500};
  background: ${({ theme }) => theme.colors.neutral100};
  position: sticky;
  top: 0;
`;

const ResultItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary100 : "transparent"};
  color: ${({ theme }) => theme.colors.neutral800};
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * CommandPalette — searchable modal for all toolbar commands.
 *
 * Props:
 *   isOpen    {boolean}
 *   onClose   {() => void}
 *   onExecute {(command) => void}  — caller deletes slash if needed, then calls action
 *   commands  {Array<{ id, name, group, keywords[], action }>}
 */
export default function CommandPalette({ isOpen, onClose, onExecute, commands }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  // Reset and focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const filtered = query
    ? commands.filter((c) =>
        `${c.name} ${c.keywords.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : commands;

  // Group results preserving toolbar group order
  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  // Flat list for keyboard navigation
  const flat = Object.values(grouped).flat();

  function execute(cmd) {
    onExecute(cmd);
    onClose();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[activeIndex]) execute(flat[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!isOpen) return null;

  let flatIdx = 0;
  return (
    <Overlay onClick={onClose}>
      <PaletteBox onClick={(e) => e.stopPropagation()}>
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search commands…"
          aria-label="Command palette search"
        />
        <ResultsList>
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group}>
              <GroupHeader>{group}</GroupHeader>
              {cmds.map((cmd) => {
                const idx = flatIdx++;
                return (
                  <ResultItem
                    key={cmd.id}
                    $active={idx === activeIndex}
                    type="button"
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    {cmd.name}
                  </ResultItem>
                );
              })}
            </div>
          ))}
          {flat.length === 0 && (
            <Box padding={4}>
              <Typography textColor="neutral500">
                No commands match &ldquo;{query}&rdquo;
              </Typography>
            </Box>
          )}
        </ResultsList>
      </PaletteBox>
    </Overlay>
  );
}
