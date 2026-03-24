import ColumnGroupCms from "./sections/ColumnGroupCms";

/**
 * DynamicZone
 *
 * Renders the sections array from a Strapi page.
 * Each section has a __component discriminator that maps to a React component.
 */
export default function DynamicZone({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.__component}-${index}`;
        const sectionVariant = index === 0 ? "hero" : "default";

        switch (section.__component) {
          case "sections.column-group":
            return (
              <ColumnGroupCms
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
