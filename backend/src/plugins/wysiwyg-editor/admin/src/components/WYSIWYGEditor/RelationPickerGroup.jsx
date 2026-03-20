import { useState, useEffect } from "react";
import { useFetchClient } from "@strapi/admin/strapi-admin";
import { Field, SingleSelect, SingleSelectOption } from "@strapi/design-system";

/**
 * Toolbar dropdown that fetches entries from a Strapi content type and inserts
 * a [ref:type:id] embed token at the editor cursor on selection.
 *
 * @param {object} props
 * @param {React.MutableRefObject} props.editorRef - CodeMirror instance ref
 * @param {boolean} props.disabled
 * @param {{ type, label, apiPath, displayField }} props.config - from relation-config.js
 */
export default function RelationPickerGroup({ editorRef, disabled, config }) {
  const { get } = useFetchClient();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Use the content-manager API — the admin JWT is not accepted by /api/* endpoints.
    // UID format: api::{type}.{type}  e.g. api::bullet-list.bullet-list
    const uid = `api::${config.type}.${config.type}`;
    get(
      `/content-manager/collection-types/${uid}?fields[0]=id&fields[1]=${config.displayField}&pagination[pageSize]=100&sort=${config.displayField}:asc`,
    )
      .then(({ data }) => setOptions(data?.results ?? []))
      .catch(() => {});
  }, [config.type, config.displayField]);

  const handleSelect = (id) => {
    const cm = editorRef.current;
    if (!cm || disabled) return;
    cm.replaceSelection(`[ref:${config.type}:${id}]`);
    cm.focus();
  };

  return (
    <Field.Root>
      <SingleSelect
        disabled={disabled || options.length === 0}
        placeholder={options.length === 0 ? `${config.label}…` : config.label}
        aria-label={`Embed ${config.label}`}
        onChange={handleSelect}
        size="S"
      >
        {options.map((item) => (
          <SingleSelectOption key={item.id} value={String(item.id)}>
            {item[config.displayField] ?? `#${item.id}`}
          </SingleSelectOption>
        ))}
      </SingleSelect>
    </Field.Root>
  );
}
