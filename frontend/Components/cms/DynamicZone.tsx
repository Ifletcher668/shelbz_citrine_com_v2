import RowCms from "@/Components/cms/sections/RowCms";
import type { StrapiPageSection } from "@/types/cms";

interface DynamicZoneProps {
  sections: StrapiPageSection[] | null | undefined;
}

export default function DynamicZone({ sections }: DynamicZoneProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.__component}-${section.id}`;
        const sectionVariant = index === 0 ? "hero" : "default";

        switch (section.__component) {
          case "sections.row":
            return (
              <RowCms
                key={key}
                data={section}
                sectionVariant={sectionVariant}
              />
            );
          default:
            if (process.env.NODE_ENV === "development") {
              console.warn(
                `DynamicZone: unknown component type "${section.__component}"`,
              );
            }
            return null;
        }
      })}
    </>
  );
}
