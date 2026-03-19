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

export interface NavigationLogoImage extends Struct.ComponentSchema {
  collectionName: 'components_navigation_logo_images';
  info: {
    displayName: 'Logo Image';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/'>;
  };
}

export interface NavigationLogoText extends Struct.ComponentSchema {
  collectionName: 'components_navigation_logo_texts';
  info: {
    displayName: 'Logo Text';
    icon: 'bold';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/'>;
    text: Schema.Attribute.String;
  };
}

export interface NavigationNavLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_links';
  info: {
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    page: Schema.Attribute.Relation<'manyToOne', 'api::page.page'>;
    url: Schema.Attribute.String;
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
    description: 'Rich text body for all the basic page content';
    displayName: 'Text Block';
    icon: 'file-text';
  };
  attributes: {
    anchor_id: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    animation: Schema.Attribute.Enumeration<
      [
        'fade-up',
        'fade-down',
        'fade-left',
        'fade-right',
        'fade-in',
        'scale-in',
        'none',
      ]
    > &
      Schema.Attribute.DefaultTo<'fade-up'>;
    background: Schema.Attribute.Enumeration<
      ['void', 'stone-dark', 'stone-deeper', 'transparent']
    > &
      Schema.Attribute.DefaultTo<'void'>;
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'plugin::wysiwyg-editor.wysiwyg-editor'>;
    container_size: Schema.Attribute.Enumeration<
      ['narrow', 'reading', 'wide']
    > &
      Schema.Attribute.DefaultTo<'reading'>;
    corners: Schema.Attribute.Enumeration<['none', 'accent', 'flourish']> &
      Schema.Attribute.DefaultTo<'none'>;
    enable_prose: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    overlay: Schema.Attribute.Enumeration<['none', 'vignette', 'fog']> &
      Schema.Attribute.DefaultTo<'none'>;
    texture: Schema.Attribute.Enumeration<
      ['none', 'metal', 'stone', 'rune', 'gallery']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    texture_opacity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    vertical_spacing: Schema.Attribute.Enumeration<
      ['tight', 'normal', 'loose']
    > &
      Schema.Attribute.DefaultTo<'normal'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'faq-item.faq-item': FaqItemFaqItem;
      'navigation.logo-image': NavigationLogoImage;
      'navigation.logo-text': NavigationLogoText;
      'navigation.nav-link': NavigationNavLink;
      'sections.cta': SectionsCta;
      'sections.faq': SectionsFaq;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.text-block': SectionsTextBlock;
    }
  }
}
