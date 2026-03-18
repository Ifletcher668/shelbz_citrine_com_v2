import type { Schema, Struct } from '@strapi/strapi';

export interface FaqItemFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_faq_item_faq_items';
  info: {
    description: 'Single question and answer pair';
    displayName: 'FAQ Item';
    icon: 'question-mark';
  };
  attributes: {
    answer: Schema.Attribute.String & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_ctas';
  info: {
    description: 'Call-to-action section with headline, body, and button';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    body: Schema.Attribute.Text;
    button_link: Schema.Attribute.String;
    button_text: Schema.Attribute.String;
    headline: Schema.Attribute.String;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    description: 'Accordion-style FAQ section';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    items: Schema.Attribute.Component<'faq-item.faq-item', true>;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    description: 'Image gallery with optional title';
    displayName: 'Gallery';
    icon: 'landscape';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Full-width hero section with headline and CTA';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    cta_link: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    headline: Schema.Attribute.String;
    subheadline: Schema.Attribute.Text;
  };
}

export interface SectionsTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_blocks';
  info: {
    description: 'Heading + rich text body with alignment control';
    displayName: 'Text Block';
    icon: 'file-text';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    body: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'faq-item.faq-item': FaqItemFaqItem;
      'sections.cta': SectionsCta;
      'sections.faq': SectionsFaq;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.text-block': SectionsTextBlock;
    }
  }
}
