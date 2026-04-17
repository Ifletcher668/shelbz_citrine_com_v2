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
    column_name: Schema.Attribute.String &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'Column'>;
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

export interface FormInputField extends Struct.ComponentSchema {
  collectionName: 'components_form_input_fields';
  info: {
    description: 'A single form field \u2014 any standard HTML input type or textarea';
    displayName: 'Input Field';
    icon: 'pencil';
  };
  attributes: {
    help_text: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      ['text', 'email', 'tel', 'number', 'url', 'date', 'time', 'textarea']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
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
    path: Schema.Attribute.String;
    sub_navigation: Schema.Attribute.Relation<
      'manyToOne',
      'api::navigation.navigation'
    >;
    url: Schema.Attribute.String;
  };
}

export interface SectionsMediaGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_galleries';
  info: {
    description: 'A paginated or filterable image gallery, sourced from the Strapi Media Library';
    displayName: 'Media Gallery';
    icon: 'landscape';
  };
  attributes: {
    Images: Schema.Attribute.Media<'images' | 'videos', true>;
    pagination_count: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pagination_filter: Schema.Attribute.Enumeration<['year', 'number']>;
    title: Schema.Attribute.String;
    use_pagination: Schema.Attribute.Boolean;
  };
}

export interface SectionsRow extends Struct.ComponentSchema {
  collectionName: 'components_sections_rows';
  info: {
    description: 'A row containing up to six WYSIWYG columns. Column order determines layout position.';
    displayName: 'Row';
    icon: 'grid';
  };
  attributes: {
    columns: Schema.Attribute.Component<'column.column', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    row_name: Schema.Attribute.String & Schema.Attribute.Private;
    section_id: Schema.Attribute.String & Schema.Attribute.Unique;
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

export interface ThemeLayout extends Struct.ComponentSchema {
  collectionName: 'components_theme_layout';
  info: {
    description: 'Container widths, border radii, and animation timing functions';
    displayName: 'Layout';
    icon: 'layout';
  };
  attributes: {
    container_narrow: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'41.625rem'>;
    container_reading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'62rem'>;
    container_wide: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'80rem'>;
    radius_lg: Schema.Attribute.String & Schema.Attribute.DefaultTo<'0'>;
    radius_md: Schema.Attribute.String & Schema.Attribute.DefaultTo<'0'>;
    radius_sm: Schema.Attribute.String & Schema.Attribute.DefaultTo<'0'>;
    timing_sharp: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'cubic-bezier(0.4, 0, 0.6, 1)'>;
    timing_smooth: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'cubic-bezier(0.4, 0, 0.2, 1)'>;
    timing_souls: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'cubic-bezier(0.25, 0.1, 0.25, 1)'>;
  };
}

export interface ThemePageLayout extends Struct.ComponentSchema {
  collectionName: 'components_theme_page_layouts';
  info: {
    displayName: 'Page Layout';
    icon: 'layout';
  };
  attributes: {
    left_sidebar: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    right_sidebar: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ThemeSemanticColors extends Struct.ComponentSchema {
  collectionName: 'components_theme_semantic_colors';
  info: {
    description: '12 color slots named by their role in the app. Each slot drives multiple CSS variables so changing one value cascades through the whole UI.';
    displayName: 'Colors';
    icon: 'paint-brush';
  };
  attributes: {
    accent: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#b4aa96'>;
    bg_base: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#000000'>;
    bg_inset: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#141414'>;
    bg_raised: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#0a0a0a'>;
    danger: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#4a1a1a'>;
    info: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#b8c5d6'>;
    interactive: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#291d0466'>;
    neutral: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#424852'>;
    success: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#2d3a2e'>;
    text_body: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#8c8273'>;
    text_heading: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#e5e0d8'>;
    text_muted: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color-picker'> &
      Schema.Attribute.DefaultTo<'#5a5a5a'>;
  };
}

export interface ThemeSpacing extends Struct.ComponentSchema {
  collectionName: 'components_theme_spacing';
  info: {
    description: 'Fluid spacing scale \u2014 maps to Tailwind p-*, m-*, gap-* utilities. Values are CSS (clamp() supported).';
    displayName: 'Spacing';
    icon: 'grid';
  };
  attributes: {
    spacing_1: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(0.25rem, 0.5vw, 0.5rem)'>;
    spacing_10: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(2.5rem, 5vw, 4rem)'>;
    spacing_12: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(3rem, 6vw, 5rem)'>;
    spacing_16: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(4rem, 8vw, 6rem)'>;
    spacing_2: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(0.5rem, 1vw, 0.75rem)'>;
    spacing_20: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(5rem, 10vw, 8rem)'>;
    spacing_3: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(0.75rem, 1.5vw, 1rem)'>;
    spacing_4: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1rem, 2vw, 1.25rem)'>;
    spacing_5: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.25rem, 2.5vw, 1.5rem)'>;
    spacing_6: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.5rem, 3vw, 2rem)'>;
    spacing_8: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(2rem, 4vw, 3rem)'>;
  };
}

export interface ThemeTypography extends Struct.ComponentSchema {
  collectionName: 'components_theme_typography';
  info: {
    description: 'Font families and fluid type scale. Font stacks as CSS font-family values; sizes as CSS values (clamp() supported).';
    displayName: 'Typography';
    icon: 'text';
  };
  attributes: {
    font_body: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"Crimson Text", Georgia, serif'>;
    font_display: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"Cinzel", serif'>;
    font_mono: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"IBM Plex Mono", "Courier New", monospace'>;
    font_sans: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"Cinzel", serif'>;
    font_serif: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"Crimson Text", Georgia, serif'>;
    font_ui: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'"Cinzel", serif'>;
    google_fonts_url: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap'>;
    text_2xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.5rem, 3vw, 2rem)'>;
    text_3xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.75rem, 4vw, 2.5rem)'>;
    text_4xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(2.25rem, 5vw, 3.5rem)'>;
    text_5xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(3rem, 6vw, 4.5rem)'>;
    text_6xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(3.5rem, 8vw, 5.5rem)'>;
    text_base: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.25rem'>;
    text_lg: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.375rem, 2.5vw, 1.5rem)'>;
    text_md: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.25rem, 2vw, 1.375rem)'>;
    text_sm: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1.125rem'>;
    text_xl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'clamp(1.4rem, 2.8vw, 1.8rem)'>;
    text_xs: Schema.Attribute.String & Schema.Attribute.DefaultTo<'1rem'>;
  };
}

export interface UiButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_button_links';
  info: {
    displayName: 'Button Link';
    icon: 'link';
  };
  attributes: {
    page: Schema.Attribute.Relation<'manyToOne', 'api::page.page'>;
    type: Schema.Attribute.Enumeration<['internal', 'external']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'external'>;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'bullet-list.bullet-item': BulletListBulletItem;
      'column.column': ColumnColumn;
      'faq-item.faq-item': FaqItemFaqItem;
      'form.input-field': FormInputField;
      'navigation.logo-image': NavigationLogoImage;
      'navigation.logo-text': NavigationLogoText;
      'navigation.nav-link': NavigationNavLink;
      'sections.media-gallery': SectionsMediaGallery;
      'sections.row': SectionsRow;
      'step.step': StepStep;
      'theme.layout': ThemeLayout;
      'theme.page-layout': ThemePageLayout;
      'theme.semantic-colors': ThemeSemanticColors;
      'theme.spacing': ThemeSpacing;
      'theme.typography': ThemeTypography;
      'ui.button-link': UiButtonLink;
    }
  }
}
