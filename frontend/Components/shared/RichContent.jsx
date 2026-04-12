import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { parseWithRelations } from "../../lib/marked-extensions";
import { useRelations } from "../../lib/RelationsContext";
import { useMediaMap } from "../../lib/MediaContext";
import ContactFormEmbed from "./ContactFormEmbed";

export default function RichContent({
  body,
  className = undefined,
  as: Tag = "div",
}) {
  const relations = useRelations();
  const mediaMap = useMediaMap();
  const containerRef = useRef(null);
  const [portals, setPortals] = useState([]);

  const html = useMemo(
    () => (body ? parseWithRelations(body, relations, mediaMap) : ""),
    [body, relations, mediaMap],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const slots = container.querySelectorAll(".md-contact-form[data-config]");
    if (slots.length === 0) return;

    setPortals(
      Array.from(slots).map((slot) => {
        const config = JSON.parse(decodeURIComponent(slot.dataset.config));
        slot.innerHTML = ""; // hand ownership to React
        return createPortal(<ContactFormEmbed config={config} />, slot);
      }),
    );
  }, [html]);

  if (!body) return null;

  const classes = ["md-content", className].filter(Boolean).join(" ");
  return (
    <>
      <Tag
        ref={containerRef}
        className={classes}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {portals}
    </>
  );
}
