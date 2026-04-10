import React, { useState, useEffect, useRef } from "react";
import {
  SingleSelect,
  SingleSelectOption,
  Button,
  Box,
  Typography,
} from "@strapi/design-system";
import { styled } from "styled-components";
import { ALLOWED_MD_ATTRS } from "../../utils/marked-extensions";

const Popover = styled.div`
  position: fixed;
  z-index: 10001;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.filterShadow};
  padding: ${({ theme }) => theme.spaces[4]};
  min-width: 220px;
`;

export default function BlockEditPopover({
  tagName,
  currentAttrs,
  position,
  onConfirm,
  onClose,
}) {
  const [draft, setDraft] = useState({ ...currentAttrs });
  const popoverRef = useRef(null);
  const allowed = ALLOWED_MD_ATTRS[tagName] ?? {};

  useEffect(() => {
    function handle(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        // Don't close if the click is inside a portal dropdown (e.g. Strapi SingleSelect listbox)
        if (e.target.closest('[role="listbox"],[role="option"],[data-radix-popper-content-wrapper]')) return;
        onClose();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  useEffect(() => {
    function handle(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <Popover
      ref={popoverRef}
      style={{ top: position.top + 4, left: position.left }}
    >
      <Typography variant="sigma" textColor="neutral600">
        {tagName.replace(/^md-/, "").replace(/-/g, " ")}
      </Typography>
      <Box
        paddingTop={3}
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {Object.entries(allowed).map(([attr, def]) => (
          <SingleSelect
            key={attr}
            label={attr}
            placeholder={def.placeholder}
            value={draft[attr] ?? ""}
            onChange={(val) => setDraft((d) => ({ ...d, [attr]: val }))}
          >
            {def.values.map((v) => (
              <SingleSelectOption key={v} value={v}>
                {v}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        ))}
      </Box>
      <Box
        paddingTop={3}
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        <Button variant="tertiary" size="S" onClick={onClose}>
          Cancel
        </Button>
        <Button size="S" onClick={() => onConfirm(draft)}>
          Apply
        </Button>
      </Box>
    </Popover>
  );
}
