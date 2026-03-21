import React, { forwardRef, useRef } from 'react';
import { Box, Flex, Field, Typography } from '@strapi/design-system';
import { styled } from 'styled-components';

// ── Styled components ──────────────────────────────────────────────────────────

/**
 * The colored circle. Clicking it opens the hidden native color picker that
 * sits on top of it. The background-color uses the raw CSS value so even
 * rgb(), rgba(), or 8-digit hex (with alpha) will display correctly.
 */
const Swatch = styled.button`
  position: relative;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger600 : theme.colors.neutral300};
  background-color: ${({ $color }) => $color || 'transparent'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary600};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary600};
    outline-offset: 2px;
  }
`;

/**
 * The native <input type="color"> is invisible but fills the swatch so
 * clicking anywhere on the circle opens the OS color picker dialog.
 * It only understands 6-digit hex, so we normalise before passing it in.
 */
const NativePicker = styled.input.attrs({ type: 'color' })`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: inherit;
  border: none;
  padding: 0;
`;

const TextInput = styled.input`
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme.colors.neutral0};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger600 : theme.colors.neutral300};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  padding: 0 ${({ theme }) => theme.spaces[3]};
  height: 2.25rem;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral400};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary600};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.neutral100};
    color: ${({ theme }) => theme.colors.neutral500};
    cursor: not-allowed;
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Convert any color value to a 6-digit hex string for the native picker.
 * Falls back to #000000 for values the picker can't handle (rgb, 8-digit hex).
 */
function toPickerHex(value) {
  if (!value) return '#000000';
  // Strip alpha from 8-digit hex: #rrggbbaa → #rrggbb
  if (/^#[0-9a-fA-F]{8}$/.test(value)) return value.slice(0, 7);
  // Accept 6-digit hex as-is
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  // Accept 3-digit hex, expand it
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return '#000000';
}

// ── Component ──────────────────────────────────────────────────────────────────

const ColorPicker = forwardRef(function ColorPicker(
  {
    name,
    value = '',
    onChange,
    disabled = false,
    required = false,
    error,
    hint,
    label,
    labelAction,
    placeholder = '#000000',
  },
  ref
) {
  const pickerRef = useRef(null);
  const hasError = Boolean(error);

  function emit(newValue) {
    onChange({ target: { name, value: newValue, type: 'text' } });
  }

  function handleTextChange(e) {
    emit(e.target.value);
  }

  function handlePickerChange(e) {
    // Native picker always gives 6-digit hex — write it directly
    emit(e.target.value);
  }

  return (
    <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
      <Flex direction="column" alignItems="stretch" gap={1}>
        {label && (
          <Flex gap={1}>
            <Field.Label action={labelAction}>{label}</Field.Label>
          </Flex>
        )}

        <Flex gap={2} alignItems="center">
          {/* Swatch circle — clicking opens the native color picker */}
          <Swatch
            type="button"
            $color={value || undefined}
            $hasError={hasError}
            disabled={disabled}
            aria-label="Open color picker"
            title={value || 'No color set'}
          >
            <NativePicker
              ref={pickerRef}
              value={toPickerHex(value)}
              onChange={handlePickerChange}
              disabled={disabled}
              tabIndex={-1}
              aria-hidden="true"
            />
          </Swatch>

          {/* Hex / CSS text input */}
          <TextInput
            ref={ref}
            type="text"
            name={name}
            value={value}
            onChange={handleTextChange}
            disabled={disabled}
            placeholder={placeholder}
            $hasError={hasError}
            aria-label={label || name}
            spellCheck={false}
          />
        </Flex>

        <Field.Error />
        <Field.Hint />
      </Flex>
    </Field.Root>
  );
});

export default ColorPicker;
