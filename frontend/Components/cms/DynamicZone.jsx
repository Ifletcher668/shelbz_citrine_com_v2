import HeroCms from './sections/HeroCms';
import TextBlockCms from './sections/TextBlockCms';
import GalleryCms from './sections/GalleryCms';
import FaqCms from './sections/FaqCms';
import CtaCms from './sections/CtaCms';

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

        switch (section.__component) {
          case 'sections.hero':
            return <HeroCms key={key} data={section} />;
          case 'sections.text-block':
            return <TextBlockCms key={key} data={section} />;
          case 'sections.gallery':
            return <GalleryCms key={key} data={section} />;
          case 'sections.faq':
            return <FaqCms key={key} data={section} />;
          case 'sections.cta':
            return <CtaCms key={key} data={section} />;
          default:
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `DynamicZone: unknown component type "${section.__component}"`
              );
            }
            return null;
        }
      })}
    </>
  );
}
