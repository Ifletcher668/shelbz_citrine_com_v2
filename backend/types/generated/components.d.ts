import type { Schema, Struct } from '@strapi/strapi';

export interface BulletListBulletItem extends Struct.ComponentSchema {
  collectionName: 'components_bullet_list_bullet_items';
  info: {
    displayName: 'Bullet Item';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['check', 'x']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'check'>;
  };
}

export interface ColumnColumn extends Struct.ComponentSchema {
  collectionName: 'components_column_columns';
  info: {
    description: 'A single column with WYSIWYG body content';
    displayName: 'Column';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'plugin::wysiwyg-editor.wysiwyg-editor'>;
    column_name: Schema.Attribute.String & Schema.Attribute.Private;
  };
}

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

export interface FooterBrandColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_brand_columns';
  info: {
    displayName: 'Brand Column';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface FooterContactColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_contact_columns';
  info: {
    displayName: 'Contact Column';
    icon: 'envelop';
  };
  attributes: {
    email: Schema.Attribute.Email;
    heading: Schema.Attribute.String;
    location: Schema.Attribute.String;
    note: Schema.Attribute.String;
  };
}

export interface FooterLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_items';
  info: {
    displayName: 'Link Item';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FooterLinksColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_links_columns';
  info: {
    displayName: 'Links Column';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    links: Schema.Attribute.Component<'footer.link-item', true>;
  };
}

export interface FooterRichtextColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_richtext_columns';
  info: {
    displayName: 'Rich Text Column';
    icon: 'pencil';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'plugin::wysiwyg-editor.wysiwyg-editor'>;
    heading: Schema.Attribute.String;
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

export interface SectionsButton extends Struct.ComponentSchema {
  collectionName: 'components_sections_buttons';
  info: {
    description: 'Standalone button section';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    anchor_id: Schema.Attribute.String;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SectionsColumnGroup extends Struct.ComponentSchema {
  collectionName: 'components_sections_column_groups';
  info: {
    description: 'A flexible grid of WYSIWYG columns (up to 4). Column count is implicit from the number of items added.';
    displayName: 'Column Group';
    icon: 'grid';
  };
  attributes: {
    colum_name: Schema.Attribute.String & Schema.Attribute.Private;
    columns: Schema.Attribute.Component<'column.column', true>;
    section_id: Schema.Attribute.String & Schema.Attribute.Unique;
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

export interface SectionsImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_images';
  info: {
    description: 'Standalone image section';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alt_text: Schema.Attribute.String;
    anchor_id: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SectionsStepGroup extends Struct.ComponentSchema {
  collectionName: 'components_sections_step_groups';
  info: {
    description: 'An ordered sequence of Steps with configurable column count (2\u20135). Includes optional CTA button.';
    displayName: 'Step Group';
    icon: 'arrow-right';
  };
  attributes: {
    columns: Schema.Attribute.Enumeration<['2', '3', '4', '5']> &
      Schema.Attribute.DefaultTo<'5'>;
    cta_link: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'step.step', true>;
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

export interface StepStep extends Struct.ComponentSchema {
  collectionName: 'components_step_steps';
  info: {
    description: 'A single process step with an icon name (Lucide), title, and WYSIWYG description';
    displayName: 'Step';
    icon: 'arrow-right';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<'plugin::wysiwyg-editor.wysiwyg-editor'>;
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 64;
      }>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'bullet-list.bullet-item': BulletListBulletItem;
      'column.column': ColumnColumn;
      'faq-item.faq-item': FaqItemFaqItem;
      'footer.brand-column': FooterBrandColumn;
      'footer.contact-column': FooterContactColumn;
      'footer.link-item': FooterLinkItem;
      'footer.links-column': FooterLinksColumn;
      'footer.richtext-column': FooterRichtextColumn;
      'navigation.logo-image': NavigationLogoImage;
      'navigation.logo-text': NavigationLogoText;
      'navigation.nav-link': NavigationNavLink;
      'sections.button': SectionsButton;
      'sections.column-group': SectionsColumnGroup;
      'sections.cta': SectionsCta;
      'sections.faq': SectionsFaq;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.image': SectionsImage;
      'sections.step-group': SectionsStepGroup;
      'sections.text-block': SectionsTextBlock;
      'step.step': StepStep;
    }
  }
}
