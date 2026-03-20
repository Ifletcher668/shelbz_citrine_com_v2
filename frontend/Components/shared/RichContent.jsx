import { parseWithRelations } from "@/lib/marked-extensions";
import { useRelations } from "@/lib/RelationsContext";

export default function RichContent({ body, className, as: Tag = "div" }) {
  const relations = useRelations();
  if (!body) return null;
  const html = parseWithRelations(body, relations);
  const classes = ["md-content", className].filter(Boolean).join(" ");
  return (
    <Tag className={classes} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
