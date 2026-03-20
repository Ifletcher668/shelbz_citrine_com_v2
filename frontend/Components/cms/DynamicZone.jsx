import ColumnGroupCms from "./sections/ColumnGroupCms";
import StepGroupCms from "./sections/StepGroupCms";
import GalleryCms from "./sections/GalleryCms";
import FaqCms from "./sections/FaqCms";
import ImageCms from "./sections/ImageCms";
import ButtonCms from "./sections/ButtonCms";

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
          case "sections.step-group":
            return <StepGroupCms key={key} data={section} />;
          case "sections.gallery":
            return <GalleryCms key={key} data={section} />;
          case "sections.faq":
            return <FaqCms key={key} data={section} />;
          case "sections.image":
            return <ImageCms key={key} data={section} />;
          case "sections.button":
            return <ButtonCms key={key} data={section} />;
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
