import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arraySwap,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { produce } from 'immer';
import {
  Box,
  Flex,
  Typography,
  IconButton,
  Grid,
  Dialog,
  Field,
} from '@strapi/design-system';
import { Drag } from '@strapi/icons';
import { styled } from 'styled-components';
import { unstable_useContentManagerContext } from '@strapi/strapi/admin';

// ── Constants ─────────────────────────────────────────────────────────────────

const GRID_COLUMNS = 12;
const TEMP = '_TEMP_';
const SUBMIT_FIELD = '_submit';

const SIZE_OPTIONS = [
  { label: '33%', cols: 4 },
  { label: '50%', cols: 6 },
  { label: '66%', cols: 8 },
  { label: '100%', cols: 12 },
];

// ── Styled ────────────────────────────────────────────────────────────────────

const DragHandle = styled(IconButton)`
  height: unset;
  align-self: stretch;
  display: flex;
  align-items: center;
  padding: 0 8px;
  border: none;
  background-color: transparent;
  border-radius: 0;
  border-right: 1px solid ${({ theme }) => theme.colors.neutral150};
  cursor: all-scroll;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const SizeButton = styled.button`
  flex: 1;
  padding: 12px 8px;
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary600 : theme.colors.neutral200};
  background: ${({ $active, theme }) => $active ? theme.colors.primary100 : theme.colors.neutral0};
  color: ${({ $active, theme }) => $active ? theme.colors.primary600 : theme.colors.neutral800};
  border-radius: 4px;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  font-size: 0.875rem;
  transition: border-color 0.1s, background 0.1s;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary500};
    background: ${({ theme }) => theme.colors.primary100};
  }
`;

// ── DnD helpers ───────────────────────────────────────────────────────────────

const DroppableContainer = ({ id, children }) => {
  const droppable = useDroppable({ id });
  return children(droppable);
};

const SortableItem = ({ id, children }) => {
  const { attributes, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString({
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
      scaleX: 1,
      scaleY: 1,
    }),
    transition,
    height: '100%',
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children}
    </div>
  );
};

// ── Layout format conversions ─────────────────────────────────────────────────

function toDndRows(layout) {
  return layout.map((row, ri) => ({
    rowId: `row-${ri}`,
    cells: row.map((cell, ci) => ({
      ...cell,
      dndId: `row-${ri}-cell-${ci}`,
    })),
  }));
}

function fromDndRows(rows) {
  return rows
    .map((row) => row.cells.filter((c) => c.name !== TEMP).map(({ dndId: _, ...c }) => c))
    .filter((row) => row.length > 0);
}

function withSpacers(rows) {
  return rows.map((row) => {
    const realCells = row.cells.filter((c) => c.name !== TEMP);
    const used = realCells.reduce((acc, c) => acc + c.size, 0);
    if (used < GRID_COLUMNS) {
      return {
        ...row,
        cells: [
          ...realCells,
          { name: TEMP, size: GRID_COLUMNS - used, dndId: `${row.rowId}-spacer` },
        ],
      };
    }
    return { ...row, cells: realCells };
  });
}

function parseLayout(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { return []; }
}

/**
 * Merge stored layout with current fieldNames + submit button.
 * - Keeps existing arrangement for known fields.
 * - Removes cells for fields no longer in fieldNames.
 * - Appends any new/missing fields as full-width rows at the end.
 * - Ensures _submit is always last.
 */
function syncLayout(storedLayout, fieldNames) {
  const allNames = [...fieldNames, SUBMIT_FIELD];

  // Filter stored rows to only cells that are still valid
  const filtered = storedLayout
    .map((row) => row.filter((cell) => allNames.includes(cell.name)))
    .filter((row) => row.length > 0);

  // Find which fields are not yet in the filtered layout
  const placed = new Set(filtered.flatMap((r) => r.map((c) => c.name)));
  const missing = allNames.filter((n) => !placed.has(n));

  // Append missing fields as individual full-width rows
  return [...filtered, ...missing.map((n) => [{ name: n, size: GRID_COLUMNS }])];
}

// ── FieldCard ─────────────────────────────────────────────────────────────────

function FieldCard({ cell, onResize, dragListeners, dragRef }) {
  if (!cell || cell.name === TEMP) {
    return <Flex tag="span" height="100%" style={{ opacity: 0 }} />;
  }

  const displayName = cell.name === SUBMIT_FIELD ? 'Submit Button' : cell.name;

  return (
    <Flex
      borderColor="neutral150"
      background="neutral100"
      hasRadius
      gap={3}
      height="100%"
    >
      <DragHandle
        ref={dragRef}
        tag="span"
        withTooltip={false}
        label={`Move ${displayName}`}
        {...dragListeners}
      >
        <Drag />
      </DragHandle>
      <Flex
        direction="column"
        alignItems="flex-start"
        grow={1}
        overflow="hidden"
        paddingTop={2}
        paddingBottom={2}
        paddingRight={2}
      >
        <Flex gap={3} justifyContent="space-between" width="100%">
          <Typography ellipsis fontWeight="bold">
            {displayName}
          </Typography>
          {onResize && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onResize(); }}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: '#666',
                whiteSpace: 'nowrap',
              }}
            >
              {SIZE_OPTIONS.find((o) => o.cols === cell.size)?.label ?? `${Math.round((cell.size / GRID_COLUMNS) * 100)}%`}
            </button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

// ── SortableFieldCard ─────────────────────────────────────────────────────────

function SortableFieldCard({ cell, onResize }) {
  const { listeners, setActivatorNodeRef } = useSortable({ id: cell.dndId });
  return (
    <FieldCard
      cell={cell}
      onResize={onResize}
      dragRef={setActivatorNodeRef}
      dragListeners={listeners}
    />
  );
}

// ── SizePickerDialog ──────────────────────────────────────────────────────────

function SizePickerDialog({ cell, maxSize, onSelect, onClose }) {
  const displayName = cell.name === SUBMIT_FIELD ? 'Submit Button' : cell.name;
  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Content>
        <Dialog.Header>Resize "{displayName}"</Dialog.Header>
        <Dialog.Body>
          <Typography variant="omega" textColor="neutral600" paddingBottom={4}>
            Choose how wide this field should be. Fields in the same row share the total width.
          </Typography>
          <Flex gap={2} paddingTop={2}>
            {SIZE_OPTIONS.map((opt) => (
              <SizeButton
                key={opt.cols}
                type="button"
                $active={cell.size === opt.cols}
                disabled={opt.cols > maxSize && cell.size !== opt.cols}
                onClick={() => { onSelect(opt.cols); onClose(); }}
              >
                {opt.label}
              </SizeButton>
            ))}
          </Flex>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

// ── FormLayoutEditor ──────────────────────────────────────────────────────────

const FormLayoutEditor = forwardRef(function FormLayoutEditor(
  { name, value, onChange, disabled, label, hint, error, required },
  _ref,
) {
  let fieldNames = [];
  try {
    const ctx = unstable_useContentManagerContext();
    const rawFields = ctx?.form?.values?.fields;
    if (Array.isArray(rawFields)) {
      fieldNames = rawFields.map((f) => f?.name).filter(Boolean);
    }
  } catch {}

  const storedLayout = parseLayout(value);
  const effectiveLayout = syncLayout(storedLayout, fieldNames);

  const emit = (newLayout) => {
    onChange({ target: { name, value: newLayout.length ? newLayout : null, type: 'json' } });
  };

  // ── DnD state ───────────────────────────────────────────────────────────────

  const [rows, setRows] = useState(() => withSpacers(toDndRows(effectiveLayout)));
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [resizing, setResizing] = useState(null); // { rowIdx, cellIdx }

  // Sync rows when value or fieldNames change
  const prevFieldNamesRef = useRef(fieldNames);
  useEffect(() => {
    setRows(withSpacers(toDndRows(syncLayout(parseLayout(value), fieldNames))));
    prevFieldNamesRef.current = fieldNames;
  }, [value, JSON.stringify(fieldNames)]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getRowsAsMap = (r = rows) => Object.fromEntries(r.map((row) => [row.rowId, row]));

  const findRowId = (dndId, map = getRowsAsMap()) => {
    if (dndId in map) return dndId;
    return Object.keys(map).find((key) => map[key].cells.some((c) => c.dndId === dndId));
  };

  // ── Resize handler ───────────────────────────────────────────────────────────

  const handleResize = (rowIdx, cellIdx, newSize) => {
    const updatedRows = rows.map((row, ri) =>
      ri === rowIdx
        ? {
            ...row,
            cells: row.cells.map((cell, ci) =>
              ci === cellIdx ? { ...cell, size: newSize } : cell
            ),
          }
        : row
    );
    emit(fromDndRows(withSpacers(updatedRows)));
  };

  // Max size available for a cell in its row
  const getMaxSize = (rowIdx, cellIdx) => {
    const row = rows[rowIdx];
    if (!row) return GRID_COLUMNS;
    const otherSize = row.cells
      .filter((c, ci) => ci !== cellIdx && c.name !== TEMP)
      .reduce((sum, c) => sum + c.size, 0);
    return GRID_COLUMNS - otherSize;
  };

  // ── DnD handlers ────────────────────────────────────────────────────────────

  const onDragStart = ({ active }) => {
    const map = getRowsAsMap();
    const rowId = findRowId(active.id, map);
    if (!rowId) return;
    const item = map[rowId].cells.find((c) => c.dndId === active.id);
    if (item) setActiveDragItem(item);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;
    const map = getRowsAsMap();
    const activeRowId = findRowId(active.id, map);
    const overRowId = findRowId(over.id, map);
    if (!activeRowId || !overRowId) return;

    const activeRowIdx = rows.findIndex((r) => r.rowId === activeRowId);
    const overRowIdx = rows.findIndex((r) => r.rowId === overRowId);
    const draggedItem = map[activeRowId].cells.find((c) => c.dndId === active.id);
    const overItem = map[overRowId].cells.find((c) => c.dndId === over.id);
    const overIdx = map[overRowId].cells.findIndex((c) => c.dndId === over.id);
    const activeIdx = map[activeRowId].cells.findIndex((c) => c.dndId === active.id);

    if (!draggedItem) return;

    if (draggedItem.size === GRID_COLUMNS) {
      const update = produce(rows, (draft) => {
        [draft[activeRowIdx].cells, draft[overRowIdx].cells] = [
          draft[overRowIdx].cells,
          draft[activeRowIdx].cells,
        ];
      });
      setRows(update);
      return;
    }

    const update = produce(rows, (draft) => {
      draft[activeRowIdx].cells = draft[activeRowIdx].cells.filter((c) => c.dndId !== active.id);
      const target = draft[overRowIdx].cells;
      const spaceTaken = target.reduce((acc, c) => (c.name === TEMP ? acc : acc + c.size), 0);
      const noSpace = spaceTaken + draggedItem.size > GRID_COLUMNS;
      const canSwap =
        overItem &&
        overItem.name !== TEMP &&
        overItem.size === draggedItem.size &&
        activeIdx !== -1 &&
        overIdx !== -1;
      const canNewRow = activeRowIdx !== overRowIdx && GRID_COLUMNS - spaceTaken === 0;
      const overSpacer = overItem?.name === TEMP;

      if (noSpace) {
        if (canSwap) {
          const src = draft[activeRowIdx].cells;
          src.splice(activeIdx, 0, overItem);
          const di = target.findIndex((c) => c.dndId === overItem.dndId);
          if (di !== -1) target.splice(di, 1, draggedItem);
          return;
        }
        if (canNewRow) {
          const insertAt = overRowIdx + 1;
          const next = draft[insertAt];
          if (next && next.cells.filter((c) => c.name !== TEMP).length === 0) {
            next.cells = [draggedItem];
            return;
          }
          draft.splice(insertAt, 0, {
            rowId: `row-${draft.length}`,
            cells: [draggedItem],
          });
        }
        return;
      }
      if (overSpacer) {
        target.splice(overIdx, 1, draggedItem);
        return;
      }
      target.splice(overIdx, 0, draggedItem);
    });
    setRows(update);
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) { setActiveDragItem(null); return; }
    const map = getRowsAsMap();
    const activeRowId = findRowId(active.id, map);
    const overRowId = findRowId(over.id, map);
    if (!activeRowId || !overRowId) { setActiveDragItem(null); return; }

    const activeIdx = map[activeRowId].cells.findIndex((c) => c.dndId === active.id);
    const overIdx = map[overRowId].cells.findIndex((c) => c.dndId === over.id);

    const swapped = produce(map, (draft) => {
      if (activeIdx !== overIdx && activeRowId === overRowId) {
        draft[activeRowId].cells = arraySwap(draft[activeRowId].cells, activeIdx, overIdx);
      }
    });

    const updatedRows = withSpacers(
      Object.values(swapped).map(({ rowId, cells }) => ({
        rowId,
        cells: cells.map(({ dndId: _, ...c }) => c).map((c, ci) => ({
          ...c,
          dndId: `${rowId}-cell-${ci}`,
        })),
      })),
    );

    emit(fromDndRows(updatedRows));
    setActiveDragItem(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const resizingCell =
    resizing !== null
      ? rows[resizing.rowIdx]?.cells[resizing.cellIdx]
      : null;

  return (
    <Field.Root name={name} hint={hint} error={error} required={required}>
      <Field.Label>{label}</Field.Label>

      <Flex paddingTop={4} direction="column" alignItems="stretch" gap={4}>
        <Flex alignItems="flex-start" direction="column" gap={1}>
          <Typography fontWeight="bold">Displayed fields</Typography>
          <Typography variant="pi" textColor="neutral600">
            Drag &amp; drop to reorder. Click the size badge to resize a field.
          </Typography>
        </Flex>

        <Box
          padding={4}
          hasRadius
          borderStyle="dashed"
          borderWidth="1px"
          borderColor="neutral300"
        >
          <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
            <Flex direction="column" alignItems="stretch" gap={2}>
              {rows.map((row, rowIdx) => (
                <SortableContext
                  key={row.rowId}
                  id={row.rowId}
                  items={row.cells.map((c) => ({ id: c.dndId }))}
                  strategy={rectSwappingStrategy}
                >
                  <DroppableContainer id={row.rowId}>
                    {({ setNodeRef }) => (
                      <Grid.Root ref={setNodeRef} gap={2}>
                        {row.cells.map((cell, cellIdx) => (
                          <Grid.Item
                            key={cell.dndId}
                            col={cell.size}
                            xs={12}
                            direction="column"
                            alignItems="stretch"
                          >
                            <SortableItem id={cell.dndId}>
                              <SortableFieldCard
                                cell={cell}
                                onResize={
                                  cell.name !== TEMP && !disabled
                                    ? () => setResizing({ rowIdx, cellIdx })
                                    : undefined
                                }
                              />
                            </SortableItem>
                          </Grid.Item>
                        ))}
                      </Grid.Root>
                    )}
                  </DroppableContainer>
                </SortableContext>
              ))}

              <DragOverlay>
                {activeDragItem ? (
                  <FieldCard cell={activeDragItem} dragListeners={{}} dragRef={null} />
                ) : null}
              </DragOverlay>
            </Flex>
          </DndContext>
        </Box>
      </Flex>

      <Field.Hint />
      <Field.Error />

      {resizing !== null && resizingCell && resizingCell.name !== TEMP && (
        <SizePickerDialog
          cell={resizingCell}
          maxSize={getMaxSize(resizing.rowIdx, resizing.cellIdx)}
          onSelect={(newSize) => handleResize(resizing.rowIdx, resizing.cellIdx, newSize)}
          onClose={() => setResizing(null)}
        />
      )}
    </Field.Root>
  );
});

export default FormLayoutEditor;
