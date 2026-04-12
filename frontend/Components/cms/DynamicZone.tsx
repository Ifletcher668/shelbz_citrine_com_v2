import type { StrapiCms } from "../../lib/types";
import RowCms from "./sections/RowCms";
import GalleryCms from "./sections/GalleryCms";

type Props = {
  sections: StrapiCms.Page["sections"];
};

export default function DynamicZone(props: Props) {
  const { sections } = props;

  if (!sections || sections.length === 0) return null;

  const lastIndex = sections.length - 1;

  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.__component}-${section.id}`;
        const isFirst = index === 0;
        const isLast = index === lastIndex;
        const positionClass =
          isFirst && isLast
            ? "section-hero section-last"
            : isFirst
              ? "section-hero"
              : isLast
                ? "section-last"
                : undefined;

        switch (section.__component) {
          case "sections.row":
            return (
              <RowCms key={key} data={section} className={positionClass} />
            );
          case "sections.media-gallery":
            return (
              <GalleryCms key={key} data={section} className={positionClass} />
            );
          default: {
            const _exhaustive: never = section;
            if (process.env.NODE_ENV === "development") {
              console.warn(
                `DynamicZone: unknown component type "${(_exhaustive as { __component: string }).__component}"`,
              );
            }
            return null;
          }
        }
      })}
    </>
  );
}
