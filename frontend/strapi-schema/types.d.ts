/**
 * Scalar identifier accepted by the Strapi v5 REST API for relations and media.
 * Strings are treated as documentId; numbers fall back to the legacy numeric id.
 */
export type StrapiID = string | number;
/**
 * Explicit relation operations supported by Strapi v5.
 * See: https://docs.strapi.io/cms/api/rest/relations
 */
export interface RelationOperations {
    connect?: StrapiID[] | {
        documentId: string;
        position?: {
            before?: StrapiID;
            after?: StrapiID;
            start?: true;
            end?: true;
        };
    }[];
    disconnect?: StrapiID[];
    set?: StrapiID[];
}
/**
 * Input value for a relation field in create/update payloads.
 * Accepts a single id, an array of ids, or the explicit { connect | disconnect | set } form.
 * Passing a plain id or array is equivalent to 'set' — it overwrites existing relations.
 */
export type RelationInput = StrapiID | StrapiID[] | RelationOperations | null;
/**
 * Input value for a single media file field. Accepts a documentId (string) or
 * legacy numeric id.
 */
export type MediaInput = StrapiID | null;
/**
 * Input value for a multi-media field. Accepts an array of ids.
 */
export type MultiMediaInput = StrapiID[] | null;
export interface MediaFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}
export interface BaseMediaFormats {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
    [key: string]: MediaFormat | undefined;
}
export interface MediaFile {
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    focalPoint: {
        x: number;
        y: number;
    } | null;
    width: number | null;
    height: number | null;
    formats: BaseMediaFormats | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Main type for Strapi Blocks content
 */
export type BlocksContent = Block[];
/**
 * All possible block types
 */
export type Block = ParagraphBlock | HeadingBlock | QuoteBlock | CodeBlock | ListBlock | ImageBlock;
/**
 * Paragraph block - default text block
 */
export interface ParagraphBlock {
    type: 'paragraph';
    children: InlineNode[];
}
/**
 * Heading block - h1 to h6
 */
export interface HeadingBlock {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: InlineNode[];
}
/**
 * Quote block - blockquote
 */
export interface QuoteBlock {
    type: 'quote';
    children: InlineNode[];
}
/**
 * Code block - preformatted code with optional language
 */
export interface CodeBlock {
    type: 'code';
    language?: string;
    children: InlineNode[];
}
/**
 * List block - ordered or unordered
 */
export interface ListBlock {
    type: 'list';
    format: 'ordered' | 'unordered';
    children: ListItemBlock[];
}
/**
 * List item - individual item in a list
 */
export interface ListItemBlock {
    type: 'list-item';
    children: InlineNode[];
}
/**
 * Image block - embedded image with optional caption
 */
export interface ImageBlock {
    type: 'image';
    image: {
        name: string;
        alternativeText?: string | null;
        url: string;
        caption?: string | null;
        width?: number;
        height?: number;
        formats?: BaseMediaFormats | null;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        previewUrl?: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
    };
    children: InlineNode[];
}
/**
 * Inline nodes - text formatting and inline elements
 */
export type InlineNode = TextNode | LinkInline;
/**
 * Plain text node with optional formatting
 */
export interface TextNode {
    type: 'text';
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
}
/**
 * Inline link
 */
export interface LinkInline {
    type: 'link';
    url: string;
    children: TextNode[];
}
type _EntityField<T> = Exclude<keyof T & string, '__typename'>;
type _SortValue<T> = _EntityField<T> | `${_EntityField<T>}:${'asc' | 'desc'}`;
type _ApplyFields<TFull, TBase, TEntry> = TEntry extends true ? TFull : TEntry extends {
    fields: readonly (infer F extends string)[];
} ? Pick<TBase, Extract<F | 'id' | 'documentId', keyof TBase>> & Omit<TFull, keyof TBase> : TFull;
export interface UiButtonLink {
    id: number;
    __component: 'ui.button-link';
    type: 'internal' | 'external';
    url: string | null;
}
export interface StepStep {
    id: number;
    __component: 'step.step';
    icon: string | null;
    title: string;
    description: string | null;
}
export interface ThemeTypography {
    id: number;
    __component: 'theme.typography';
    google_fonts_url: string | null;
    font_display: string | null;
    font_body: string | null;
    font_ui: string | null;
    font_mono: string | null;
    text_6xl: string | null;
    text_5xl: string | null;
    text_4xl: string | null;
    text_3xl: string | null;
    text_2xl: string | null;
    text_xl: string | null;
    text_lg: string | null;
    text_md: string | null;
    text_base: string | null;
    text_sm: string | null;
    text_xs: string | null;
}
export interface ThemeSpacing {
    id: number;
    __component: 'theme.spacing';
    spacing_1: string | null;
    spacing_2: string | null;
    spacing_3: string | null;
    spacing_4: string | null;
    spacing_5: string | null;
    spacing_6: string | null;
    spacing_8: string | null;
    spacing_10: string | null;
    spacing_12: string | null;
    spacing_16: string | null;
    spacing_20: string | null;
}
export interface ThemeSemanticColors {
    id: number;
    __component: 'theme.semantic-colors';
    bg_base: string | null;
    bg_raised: string | null;
    bg_inset: string | null;
    text_muted: string | null;
    text_body: string | null;
    text_heading: string | null;
    accent: string | null;
    interactive: string | null;
    neutral: string | null;
    info: string | null;
    danger: string | null;
    success: string | null;
}
export interface ThemePageLayout {
    id: number;
    __component: 'theme.page-layout';
    left_sidebar: boolean;
    right_sidebar: boolean;
}
export interface ThemeLayout {
    id: number;
    __component: 'theme.layout';
    container_narrow: string | null;
    container_reading: string | null;
    container_wide: string | null;
    radius_lg: string | null;
    radius_md: string | null;
    radius_sm: string | null;
    timing_souls: string | null;
    timing_sharp: string | null;
    timing_smooth: string | null;
}
export interface SectionsRow {
    id: number;
    __component: 'sections.row';
    section_id: string | null;
}
export interface SectionsMediaGallery {
    id: number;
    __component: 'sections.media-gallery';
    title: string | null;
    use_pagination: boolean | null;
    pagination_filter: 'year' | 'number' | null;
    pagination_count: number | null;
}
export interface FormInputField {
    id: number;
    __component: 'form.input-field';
    label: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'number' | 'url' | 'date' | 'time' | 'textarea';
    placeholder: string | null;
    required: boolean | null;
    help_text: string | null;
}
export interface NavigationNavLink {
    id: number;
    __component: 'navigation.nav-link';
    label: string | null;
    path: string | null;
    url: string | null;
}
export interface NavigationLogoText {
    id: number;
    __component: 'navigation.logo-text';
    text: string | null;
    link: string | null;
}
export interface NavigationLogoImage {
    id: number;
    __component: 'navigation.logo-image';
    link: string | null;
}
export interface FaqItemFaqItem {
    id: number;
    __component: 'faq-item.faq-item';
    question: string;
    answer: string;
}
export interface ColumnColumn {
    id: number;
    __component: 'column.column';
    body: string | null;
}
export interface BulletListBulletItem {
    id: number;
    __component: 'bullet-list.bullet-item';
    type: 'check' | 'x';
    title: string;
    description: string | null;
}
/** Input type for creating/updating UiButtonLink */
export interface UiButtonLinkInput {
    id?: number;
    __component: 'ui.button-link';
    type?: 'internal' | 'external' | null;
    url?: string | null;
    page?: RelationInput;
}
/** Input type for creating/updating StepStep */
export interface StepStepInput {
    id?: number;
    __component: 'step.step';
    icon?: string | null;
    title?: string | null;
    description?: string | null;
}
/** Input type for creating/updating ThemeTypography */
export interface ThemeTypographyInput {
    id?: number;
    __component: 'theme.typography';
    google_fonts_url?: string | null;
    font_display?: string | null;
    font_body?: string | null;
    font_ui?: string | null;
    font_mono?: string | null;
    text_6xl?: string | null;
    text_5xl?: string | null;
    text_4xl?: string | null;
    text_3xl?: string | null;
    text_2xl?: string | null;
    text_xl?: string | null;
    text_lg?: string | null;
    text_md?: string | null;
    text_base?: string | null;
    text_sm?: string | null;
    text_xs?: string | null;
}
/** Input type for creating/updating ThemeSpacing */
export interface ThemeSpacingInput {
    id?: number;
    __component: 'theme.spacing';
    spacing_1?: string | null;
    spacing_2?: string | null;
    spacing_3?: string | null;
    spacing_4?: string | null;
    spacing_5?: string | null;
    spacing_6?: string | null;
    spacing_8?: string | null;
    spacing_10?: string | null;
    spacing_12?: string | null;
    spacing_16?: string | null;
    spacing_20?: string | null;
}
/** Input type for creating/updating ThemeSemanticColors */
export interface ThemeSemanticColorsInput {
    id?: number;
    __component: 'theme.semantic-colors';
    bg_base?: string | null;
    bg_raised?: string | null;
    bg_inset?: string | null;
    text_muted?: string | null;
    text_body?: string | null;
    text_heading?: string | null;
    accent?: string | null;
    interactive?: string | null;
    neutral?: string | null;
    info?: string | null;
    danger?: string | null;
    success?: string | null;
}
/** Input type for creating/updating ThemePageLayout */
export interface ThemePageLayoutInput {
    id?: number;
    __component: 'theme.page-layout';
    left_sidebar?: boolean | null;
    right_sidebar?: boolean | null;
}
/** Input type for creating/updating ThemeLayout */
export interface ThemeLayoutInput {
    id?: number;
    __component: 'theme.layout';
    container_narrow?: string | null;
    container_reading?: string | null;
    container_wide?: string | null;
    radius_lg?: string | null;
    radius_md?: string | null;
    radius_sm?: string | null;
    timing_souls?: string | null;
    timing_sharp?: string | null;
    timing_smooth?: string | null;
}
/** Input type for creating/updating SectionsRow */
export interface SectionsRowInput {
    id?: number;
    __component: 'sections.row';
    section_id?: string | null;
    columns?: ColumnColumnInput[] | null;
}
/** Input type for creating/updating SectionsMediaGallery */
export interface SectionsMediaGalleryInput {
    id?: number;
    __component: 'sections.media-gallery';
    title?: string | null;
    use_pagination?: boolean | null;
    pagination_filter?: 'year' | 'number' | null;
    pagination_count?: number | null;
    Images?: MultiMediaInput;
}
/** Input type for creating/updating FormInputField */
export interface FormInputFieldInput {
    id?: number;
    __component: 'form.input-field';
    label?: string | null;
    name?: string | null;
    type?: 'text' | 'email' | 'tel' | 'number' | 'url' | 'date' | 'time' | 'textarea' | null;
    placeholder?: string | null;
    required?: boolean | null;
    help_text?: string | null;
}
/** Input type for creating/updating NavigationNavLink */
export interface NavigationNavLinkInput {
    id?: number;
    __component: 'navigation.nav-link';
    label?: string | null;
    path?: string | null;
    url?: string | null;
    page?: RelationInput;
    sub_navigation?: RelationInput;
}
/** Input type for creating/updating NavigationLogoText */
export interface NavigationLogoTextInput {
    id?: number;
    __component: 'navigation.logo-text';
    text?: string | null;
    link?: string | null;
}
/** Input type for creating/updating NavigationLogoImage */
export interface NavigationLogoImageInput {
    id?: number;
    __component: 'navigation.logo-image';
    link?: string | null;
    image?: MediaInput;
}
/** Input type for creating/updating FaqItemFaqItem */
export interface FaqItemFaqItemInput {
    id?: number;
    __component: 'faq-item.faq-item';
    question?: string | null;
    answer?: string | null;
}
/** Input type for creating/updating ColumnColumn */
export interface ColumnColumnInput {
    id?: number;
    __component: 'column.column';
    body?: string | null;
}
/** Input type for creating/updating BulletListBulletItem */
export interface BulletListBulletItemInput {
    id?: number;
    __component: 'bullet-list.bullet-item';
    type?: 'check' | 'x' | null;
    title?: string | null;
    description?: string | null;
}
export interface Permission {
    readonly __typename?: 'Permission';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    action: string;
}
export interface Role {
    readonly __typename?: 'Role';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    name: string;
    description: string | null;
    type: string | null;
}
export interface User {
    readonly __typename?: 'User';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    username: string;
    email: string;
    provider: string | null;
    confirmed: boolean | null;
    blocked: boolean | null;
}
export interface Action {
    readonly __typename?: 'Action';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    name: string;
}
export interface BulletList {
    readonly __typename?: 'BulletList';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    title: string;
}
export interface Button {
    readonly __typename?: 'Button';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    text: string;
    variant: 'primary' | 'secondary' | 'tertiary';
}
export interface ContactForm {
    readonly __typename?: 'ContactForm';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    action: 'contact' | 'consultation';
    submit_label: string | null;
    success_message: string | null;
    layout: unknown | null;
}
export interface Faq {
    readonly __typename?: 'Faq';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    title: string;
}
export interface Footer {
    readonly __typename?: 'Footer';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    brand_heading: string | null;
    brand_tagline: string | null;
    brand_description: string | null;
    contact_email: string | null;
    contact_location: string | null;
    contact_service_area: string | null;
    copyright_company_name: string | null;
}
export interface Header {
    readonly __typename?: 'Header';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}
export interface MediaMetadata {
    readonly __typename?: 'MediaMetadata';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    metadata: unknown;
}
export interface Navigation {
    readonly __typename?: 'Navigation';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    name: string;
}
export interface Page {
    readonly __typename?: 'Page';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    title: string;
    slug: string;
    seo_description: string | null;
    custom_css: string | null;
}
export interface PageTemplate {
    readonly __typename?: 'PageTemplate';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    Template: 'Default' | 'Gallery Page' | 'Blog Page';
    slug: 'default_page' | 'gallery_page' | 'blog_page' | null;
}
export interface StepGroup {
    readonly __typename?: 'StepGroup';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    title: string;
    columns: 'col-2' | 'col-3' | 'col-4' | 'col-5' | null;
    cta_text: string | null;
    cta_link: string | null;
}
export interface Theme {
    readonly __typename?: 'Theme';
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    name: string;
    is_active: boolean;
}
/** Input type for creating/updating Permission */
export interface PermissionInput {
    action?: string | null;
    role?: RelationInput;
}
/** Input type for creating/updating Role */
export interface RoleInput {
    name?: string | null;
    description?: string | null;
    type?: string | null;
    permissions?: RelationInput;
    users?: RelationInput;
}
/** Input type for creating/updating User */
export interface UserInput {
    username?: string | null;
    email?: string | null;
    provider?: string | null;
    confirmed?: boolean | null;
    blocked?: boolean | null;
    role?: RelationInput;
}
/** Input type for creating/updating Action */
export interface ActionInput {
    name?: string | null;
}
/** Input type for creating/updating BulletList */
export interface BulletListInput {
    title?: string | null;
    items?: BulletListBulletItemInput[] | null;
}
/** Input type for creating/updating Button */
export interface ButtonInput {
    text?: string | null;
    variant?: 'primary' | 'secondary' | 'tertiary' | null;
    action?: RelationInput;
    link?: UiButtonLinkInput | null;
}
/** Input type for creating/updating ContactForm */
export interface ContactFormInput {
    action?: 'contact' | 'consultation' | null;
    submit_label?: string | null;
    success_message?: string | null;
    layout?: unknown | null;
    fields?: FormInputFieldInput[] | null;
}
/** Input type for creating/updating Faq */
export interface FaqInput {
    title?: string | null;
    items?: FaqItemFaqItemInput[] | null;
}
/** Input type for creating/updating Footer */
export interface FooterInput {
    brand_heading?: string | null;
    brand_tagline?: string | null;
    brand_description?: string | null;
    contact_email?: string | null;
    contact_location?: string | null;
    contact_service_area?: string | null;
    copyright_company_name?: string | null;
    navigation?: RelationInput;
}
/** Input type for creating/updating Header */
export interface HeaderInput {
    navigation?: RelationInput;
    header_cta?: UiButtonLinkInput | null;
    primary?: (NavigationLogoImageInput | NavigationLogoTextInput)[] | null;
}
/** Input type for creating/updating MediaMetadata */
export interface MediaMetadataInput {
    metadata?: unknown | null;
    Media?: MediaInput;
}
/** Input type for creating/updating Navigation */
export interface NavigationInput {
    name?: string | null;
    links?: NavigationNavLinkInput[] | null;
}
/** Input type for creating/updating Page */
export interface PageInput {
    title?: string | null;
    slug?: string | null;
    seo_description?: string | null;
    custom_css?: string | null;
    parent_page?: RelationInput;
    sub_pages?: RelationInput;
    page_template?: RelationInput;
    sections?: (SectionsRowInput | SectionsMediaGalleryInput)[] | null;
}
/** Input type for creating/updating PageTemplate */
export interface PageTemplateInput {
    Template?: 'Default' | 'Gallery Page' | 'Blog Page' | null;
    slug?: 'default_page' | 'gallery_page' | 'blog_page' | null;
    pages?: RelationInput;
}
/** Input type for creating/updating StepGroup */
export interface StepGroupInput {
    title?: string | null;
    columns?: 'col-2' | 'col-3' | 'col-4' | 'col-5' | null;
    cta_text?: string | null;
    cta_link?: string | null;
    steps?: StepStepInput[] | null;
}
/** Input type for creating/updating Theme */
export interface ThemeInput {
    name?: string | null;
    is_active?: boolean | null;
    colors?: ThemeSemanticColorsInput | null;
    typography?: ThemeTypographyInput | null;
    spacing?: ThemeSpacingInput | null;
    layout?: ThemeLayoutInput | null;
}
export type UiButtonLinkPopulateParam = {
    page?: true | {
        fields?: _EntityField<Page>[];
        populate?: PagePopulateParam | (keyof PagePopulateParam & string)[] | '*';
        filters?: PageFilters;
        sort?: _SortValue<Page> | _SortValue<Page>[];
        limit?: number;
        start?: number;
    };
};
export type SectionsRowPopulateParam = {
    columns?: true | {
        fields?: (keyof ColumnColumn & string)[];
    };
};
export type SectionsMediaGalleryPopulateParam = {
    Images?: true | {
        fields?: (keyof MediaFile & string)[];
    };
};
export type NavigationNavLinkPopulateParam = {
    page?: true | {
        fields?: _EntityField<Page>[];
        populate?: PagePopulateParam | (keyof PagePopulateParam & string)[] | '*';
        filters?: PageFilters;
        sort?: _SortValue<Page> | _SortValue<Page>[];
        limit?: number;
        start?: number;
    };
    sub_navigation?: true | {
        fields?: _EntityField<Navigation>[];
        populate?: NavigationPopulateParam | (keyof NavigationPopulateParam & string)[] | '*';
        filters?: NavigationFilters;
        sort?: _SortValue<Navigation> | _SortValue<Navigation>[];
        limit?: number;
        start?: number;
    };
};
export type NavigationLogoImagePopulateParam = {
    image?: true | {
        fields?: (keyof MediaFile & string)[];
    };
};
export type PermissionPopulateParam = {
    role?: true | {
        fields?: _EntityField<Role>[];
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*';
        filters?: RoleFilters;
        sort?: _SortValue<Role> | _SortValue<Role>[];
        limit?: number;
        start?: number;
    };
};
export type RolePopulateParam = {
    permissions?: true | {
        fields?: _EntityField<Permission>[];
        populate?: PermissionPopulateParam | (keyof PermissionPopulateParam & string)[] | '*';
        filters?: PermissionFilters;
        sort?: _SortValue<Permission> | _SortValue<Permission>[];
        limit?: number;
        start?: number;
    };
    users?: true | {
        fields?: _EntityField<User>[];
        populate?: UserPopulateParam | (keyof UserPopulateParam & string)[] | '*';
        filters?: UserFilters;
        sort?: _SortValue<User> | _SortValue<User>[];
        limit?: number;
        start?: number;
    };
};
export type UserPopulateParam = {
    role?: true | {
        fields?: _EntityField<Role>[];
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*';
        filters?: RoleFilters;
        sort?: _SortValue<Role> | _SortValue<Role>[];
        limit?: number;
        start?: number;
    };
};
export type BulletListPopulateParam = {
    items?: true | {
        fields?: (keyof BulletListBulletItem & string)[];
    };
};
export type ButtonPopulateParam = {
    action?: true | {
        fields?: _EntityField<Action>[];
        filters?: ActionFilters;
        sort?: _SortValue<Action> | _SortValue<Action>[];
        limit?: number;
        start?: number;
    };
    link?: true | {
        fields?: (keyof UiButtonLink & string)[];
        populate?: UiButtonLinkPopulateParam | (keyof UiButtonLinkPopulateParam & string)[] | '*';
    };
};
export type ContactFormPopulateParam = {
    fields?: true | {
        fields?: (keyof FormInputField & string)[];
    };
};
export type FaqPopulateParam = {
    items?: true | {
        fields?: (keyof FaqItemFaqItem & string)[];
    };
};
export type FooterPopulateParam = {
    navigation?: true | {
        fields?: _EntityField<Navigation>[];
        populate?: NavigationPopulateParam | (keyof NavigationPopulateParam & string)[] | '*';
        filters?: NavigationFilters;
        sort?: _SortValue<Navigation> | _SortValue<Navigation>[];
        limit?: number;
        start?: number;
    };
};
export type HeaderPopulateParam = {
    navigation?: true | {
        fields?: _EntityField<Navigation>[];
        populate?: NavigationPopulateParam | (keyof NavigationPopulateParam & string)[] | '*';
        filters?: NavigationFilters;
        sort?: _SortValue<Navigation> | _SortValue<Navigation>[];
        limit?: number;
        start?: number;
    };
    header_cta?: true | {
        fields?: (keyof UiButtonLink & string)[];
        populate?: UiButtonLinkPopulateParam | (keyof UiButtonLinkPopulateParam & string)[] | '*';
    };
    primary?: true | {
        on?: {
            'navigation.logo-image'?: true | {
                fields?: (keyof NavigationLogoImage & string)[];
                populate?: NavigationLogoImagePopulateParam | (keyof NavigationLogoImagePopulateParam & string)[] | '*';
            };
            'navigation.logo-text'?: true | {
                fields?: (keyof NavigationLogoText & string)[];
            };
        };
    };
};
export type MediaMetadataPopulateParam = {
    Media?: true | {
        fields?: (keyof MediaFile & string)[];
    };
};
export type NavigationPopulateParam = {
    links?: true | {
        fields?: (keyof NavigationNavLink & string)[];
        populate?: NavigationNavLinkPopulateParam | (keyof NavigationNavLinkPopulateParam & string)[] | '*';
    };
};
export type PagePopulateParam = {
    parent_page?: true | {
        fields?: _EntityField<Page>[];
        populate?: PagePopulateParam | (keyof PagePopulateParam & string)[] | '*';
        filters?: PageFilters;
        sort?: _SortValue<Page> | _SortValue<Page>[];
        limit?: number;
        start?: number;
    };
    sub_pages?: true | {
        fields?: _EntityField<Page>[];
        populate?: PagePopulateParam | (keyof PagePopulateParam & string)[] | '*';
        filters?: PageFilters;
        sort?: _SortValue<Page> | _SortValue<Page>[];
        limit?: number;
        start?: number;
    };
    page_template?: true | {
        fields?: _EntityField<PageTemplate>[];
        populate?: PageTemplatePopulateParam | (keyof PageTemplatePopulateParam & string)[] | '*';
        filters?: PageTemplateFilters;
        sort?: _SortValue<PageTemplate> | _SortValue<PageTemplate>[];
        limit?: number;
        start?: number;
    };
    sections?: true | {
        on?: {
            'sections.row'?: true | {
                fields?: (keyof SectionsRow & string)[];
                populate?: SectionsRowPopulateParam | (keyof SectionsRowPopulateParam & string)[] | '*';
            };
            'sections.media-gallery'?: true | {
                fields?: (keyof SectionsMediaGallery & string)[];
                populate?: SectionsMediaGalleryPopulateParam | (keyof SectionsMediaGalleryPopulateParam & string)[] | '*';
            };
        };
    };
};
export type PageTemplatePopulateParam = {
    pages?: true | {
        fields?: _EntityField<Page>[];
        populate?: PagePopulateParam | (keyof PagePopulateParam & string)[] | '*';
        filters?: PageFilters;
        sort?: _SortValue<Page> | _SortValue<Page>[];
        limit?: number;
        start?: number;
    };
};
export type StepGroupPopulateParam = {
    steps?: true | {
        fields?: (keyof StepStep & string)[];
    };
};
export type ThemePopulateParam = {
    colors?: true | {
        fields?: (keyof ThemeSemanticColors & string)[];
    };
    typography?: true | {
        fields?: (keyof ThemeTypography & string)[];
    };
    spacing?: true | {
        fields?: (keyof ThemeSpacing & string)[];
    };
    layout?: true | {
        fields?: (keyof ThemeLayout & string)[];
    };
};
export type UiButtonLinkGetPayload<P extends {
    populate?: any;
} = {}> = UiButtonLink & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    page?: Page | null;
} : Pop extends readonly (infer _)[] ? {
    page?: 'page' extends Pop[number] ? Page | null : never;
} : {
    page?: 'page' extends keyof Pop ? _ApplyFields<Pop['page'] extends {
        populate: infer NestedPop;
    } ? PageGetPayload<{
        populate: NestedPop;
    }> : Page, Page, Pop['page']> | null : never;
} : {});
export type SectionsRowGetPayload<P extends {
    populate?: any;
} = {}> = SectionsRow & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    columns?: ColumnColumn[];
} : Pop extends readonly (infer _)[] ? {
    columns?: 'columns' extends Pop[number] ? ColumnColumn[] : never;
} : {
    columns?: 'columns' extends keyof Pop ? _ApplyFields<ColumnColumn, ColumnColumn, Pop['columns']>[] : never;
} : {});
export type SectionsMediaGalleryGetPayload<P extends {
    populate?: any;
} = {}> = SectionsMediaGallery & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    Images?: MediaFile[];
} : Pop extends readonly (infer _)[] ? {
    Images?: 'Images' extends Pop[number] ? MediaFile[] : never;
} : {
    Images?: 'Images' extends keyof Pop ? _ApplyFields<MediaFile, MediaFile, Pop['Images']>[] : never;
} : {});
export type NavigationNavLinkGetPayload<P extends {
    populate?: any;
} = {}> = NavigationNavLink & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    page?: Page | null;
    sub_navigation?: Navigation | null;
} : Pop extends readonly (infer _)[] ? {
    page?: 'page' extends Pop[number] ? Page | null : never;
    sub_navigation?: 'sub_navigation' extends Pop[number] ? Navigation | null : never;
} : {
    page?: 'page' extends keyof Pop ? _ApplyFields<Pop['page'] extends {
        populate: infer NestedPop;
    } ? PageGetPayload<{
        populate: NestedPop;
    }> : Page, Page, Pop['page']> | null : never;
    sub_navigation?: 'sub_navigation' extends keyof Pop ? _ApplyFields<Pop['sub_navigation'] extends {
        populate: infer NestedPop;
    } ? NavigationGetPayload<{
        populate: NestedPop;
    }> : Navigation, Navigation, Pop['sub_navigation']> | null : never;
} : {});
export type NavigationLogoImageGetPayload<P extends {
    populate?: any;
} = {}> = NavigationLogoImage & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    image?: MediaFile;
} : Pop extends readonly (infer _)[] ? {
    image?: 'image' extends Pop[number] ? MediaFile : never;
} : {
    image?: 'image' extends keyof Pop ? _ApplyFields<MediaFile, MediaFile, Pop['image']> : never;
} : {});
export type PermissionGetPayload<P extends {
    populate?: any;
} = {}> = Permission & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    role?: Role | null;
} : Pop extends readonly (infer _)[] ? {
    role?: 'role' extends Pop[number] ? Role | null : never;
} : {
    role?: 'role' extends keyof Pop ? _ApplyFields<Pop['role'] extends {
        populate: infer NestedPop;
    } ? RoleGetPayload<{
        populate: NestedPop;
    }> : Role, Role, Pop['role']> | null : never;
} : {});
export type RoleGetPayload<P extends {
    populate?: any;
} = {}> = Role & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    permissions?: Permission[];
    users?: User[];
} : Pop extends readonly (infer _)[] ? {
    permissions?: 'permissions' extends Pop[number] ? Permission[] : never;
    users?: 'users' extends Pop[number] ? User[] : never;
} : {
    permissions?: 'permissions' extends keyof Pop ? _ApplyFields<Pop['permissions'] extends {
        populate: infer NestedPop;
    } ? PermissionGetPayload<{
        populate: NestedPop;
    }> : Permission, Permission, Pop['permissions']>[] : never;
    users?: 'users' extends keyof Pop ? _ApplyFields<Pop['users'] extends {
        populate: infer NestedPop;
    } ? UserGetPayload<{
        populate: NestedPop;
    }> : User, User, Pop['users']>[] : never;
} : {});
export type UserGetPayload<P extends {
    populate?: any;
} = {}> = User & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    role?: Role | null;
} : Pop extends readonly (infer _)[] ? {
    role?: 'role' extends Pop[number] ? Role | null : never;
} : {
    role?: 'role' extends keyof Pop ? _ApplyFields<Pop['role'] extends {
        populate: infer NestedPop;
    } ? RoleGetPayload<{
        populate: NestedPop;
    }> : Role, Role, Pop['role']> | null : never;
} : {});
export type BulletListGetPayload<P extends {
    populate?: any;
} = {}> = BulletList & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    items?: BulletListBulletItem[];
} : Pop extends readonly (infer _)[] ? {
    items?: 'items' extends Pop[number] ? BulletListBulletItem[] : never;
} : {
    items?: 'items' extends keyof Pop ? _ApplyFields<BulletListBulletItem, BulletListBulletItem, Pop['items']>[] : never;
} : {});
export type ButtonGetPayload<P extends {
    populate?: any;
} = {}> = Button & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    action?: Action | null;
    link?: UiButtonLink;
} : Pop extends readonly (infer _)[] ? {
    action?: 'action' extends Pop[number] ? Action | null : never;
    link?: 'link' extends Pop[number] ? UiButtonLink : never;
} : {
    action?: 'action' extends keyof Pop ? _ApplyFields<Action, Action, Pop['action']> | null : never;
    link?: 'link' extends keyof Pop ? _ApplyFields<Pop['link'] extends {
        populate: infer NestedPop;
    } ? UiButtonLinkGetPayload<{
        populate: NestedPop;
    }> : UiButtonLink, UiButtonLink, Pop['link']> : never;
} : {});
export type ContactFormGetPayload<P extends {
    populate?: any;
} = {}> = ContactForm & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    fields?: FormInputField[];
} : Pop extends readonly (infer _)[] ? {
    fields?: 'fields' extends Pop[number] ? FormInputField[] : never;
} : {
    fields?: 'fields' extends keyof Pop ? _ApplyFields<FormInputField, FormInputField, Pop['fields']>[] : never;
} : {});
export type FaqGetPayload<P extends {
    populate?: any;
} = {}> = Faq & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    items?: FaqItemFaqItem[];
} : Pop extends readonly (infer _)[] ? {
    items?: 'items' extends Pop[number] ? FaqItemFaqItem[] : never;
} : {
    items?: 'items' extends keyof Pop ? _ApplyFields<FaqItemFaqItem, FaqItemFaqItem, Pop['items']>[] : never;
} : {});
export type FooterGetPayload<P extends {
    populate?: any;
} = {}> = Footer & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    navigation?: Navigation | null;
} : Pop extends readonly (infer _)[] ? {
    navigation?: 'navigation' extends Pop[number] ? Navigation | null : never;
} : {
    navigation?: 'navigation' extends keyof Pop ? _ApplyFields<Pop['navigation'] extends {
        populate: infer NestedPop;
    } ? NavigationGetPayload<{
        populate: NestedPop;
    }> : Navigation, Navigation, Pop['navigation']> | null : never;
} : {});
export type HeaderGetPayload<P extends {
    populate?: any;
} = {}> = Header & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    navigation?: Navigation | null;
    header_cta?: UiButtonLink;
    primary?: (NavigationLogoImage | NavigationLogoText)[];
} : Pop extends readonly (infer _)[] ? {
    navigation?: 'navigation' extends Pop[number] ? Navigation | null : never;
    header_cta?: 'header_cta' extends Pop[number] ? UiButtonLink : never;
    primary?: 'primary' extends Pop[number] ? (NavigationLogoImage | NavigationLogoText)[] : never;
} : {
    navigation?: 'navigation' extends keyof Pop ? _ApplyFields<Pop['navigation'] extends {
        populate: infer NestedPop;
    } ? NavigationGetPayload<{
        populate: NestedPop;
    }> : Navigation, Navigation, Pop['navigation']> | null : never;
    header_cta?: 'header_cta' extends keyof Pop ? _ApplyFields<Pop['header_cta'] extends {
        populate: infer NestedPop;
    } ? UiButtonLinkGetPayload<{
        populate: NestedPop;
    }> : UiButtonLink, UiButtonLink, Pop['header_cta']> : never;
    primary?: 'primary' extends keyof Pop ? ((Pop['primary'] extends {
        on: infer On;
    } ? 'navigation.logo-image' extends keyof On ? On['navigation.logo-image'] extends {
        populate: infer NestedPop;
    } ? NavigationLogoImageGetPayload<{
        populate: NestedPop;
    }> : NavigationLogoImage : NavigationLogoImage : NavigationLogoImage) | NavigationLogoText)[] : never;
} : {});
export type MediaMetadataGetPayload<P extends {
    populate?: any;
} = {}> = MediaMetadata & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    Media?: MediaFile;
} : Pop extends readonly (infer _)[] ? {
    Media?: 'Media' extends Pop[number] ? MediaFile : never;
} : {
    Media?: 'Media' extends keyof Pop ? _ApplyFields<MediaFile, MediaFile, Pop['Media']> : never;
} : {});
export type NavigationGetPayload<P extends {
    populate?: any;
} = {}> = Navigation & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    links?: NavigationNavLink[];
} : Pop extends readonly (infer _)[] ? {
    links?: 'links' extends Pop[number] ? NavigationNavLink[] : never;
} : {
    links?: 'links' extends keyof Pop ? _ApplyFields<Pop['links'] extends {
        populate: infer NestedPop;
    } ? NavigationNavLinkGetPayload<{
        populate: NestedPop;
    }> : NavigationNavLink, NavigationNavLink, Pop['links']>[] : never;
} : {});
export type PageGetPayload<P extends {
    populate?: any;
} = {}> = Page & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    parent_page?: Page | null;
    sub_pages?: Page[];
    page_template?: PageTemplate | null;
    sections?: (SectionsRow | SectionsMediaGallery)[];
} : Pop extends readonly (infer _)[] ? {
    parent_page?: 'parent_page' extends Pop[number] ? Page | null : never;
    sub_pages?: 'sub_pages' extends Pop[number] ? Page[] : never;
    page_template?: 'page_template' extends Pop[number] ? PageTemplate | null : never;
    sections?: 'sections' extends Pop[number] ? (SectionsRow | SectionsMediaGallery)[] : never;
} : {
    parent_page?: 'parent_page' extends keyof Pop ? _ApplyFields<Pop['parent_page'] extends {
        populate: infer NestedPop;
    } ? PageGetPayload<{
        populate: NestedPop;
    }> : Page, Page, Pop['parent_page']> | null : never;
    sub_pages?: 'sub_pages' extends keyof Pop ? _ApplyFields<Pop['sub_pages'] extends {
        populate: infer NestedPop;
    } ? PageGetPayload<{
        populate: NestedPop;
    }> : Page, Page, Pop['sub_pages']>[] : never;
    page_template?: 'page_template' extends keyof Pop ? _ApplyFields<Pop['page_template'] extends {
        populate: infer NestedPop;
    } ? PageTemplateGetPayload<{
        populate: NestedPop;
    }> : PageTemplate, PageTemplate, Pop['page_template']> | null : never;
    sections?: 'sections' extends keyof Pop ? ((Pop['sections'] extends {
        on: infer On;
    } ? 'sections.row' extends keyof On ? On['sections.row'] extends {
        populate: infer NestedPop;
    } ? SectionsRowGetPayload<{
        populate: NestedPop;
    }> : SectionsRow : SectionsRow : SectionsRow) | (Pop['sections'] extends {
        on: infer On;
    } ? 'sections.media-gallery' extends keyof On ? On['sections.media-gallery'] extends {
        populate: infer NestedPop;
    } ? SectionsMediaGalleryGetPayload<{
        populate: NestedPop;
    }> : SectionsMediaGallery : SectionsMediaGallery : SectionsMediaGallery))[] : never;
} : {});
export type PageTemplateGetPayload<P extends {
    populate?: any;
} = {}> = PageTemplate & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    pages?: Page[];
} : Pop extends readonly (infer _)[] ? {
    pages?: 'pages' extends Pop[number] ? Page[] : never;
} : {
    pages?: 'pages' extends keyof Pop ? _ApplyFields<Pop['pages'] extends {
        populate: infer NestedPop;
    } ? PageGetPayload<{
        populate: NestedPop;
    }> : Page, Page, Pop['pages']>[] : never;
} : {});
export type StepGroupGetPayload<P extends {
    populate?: any;
} = {}> = StepGroup & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    steps?: StepStep[];
} : Pop extends readonly (infer _)[] ? {
    steps?: 'steps' extends Pop[number] ? StepStep[] : never;
} : {
    steps?: 'steps' extends keyof Pop ? _ApplyFields<StepStep, StepStep, Pop['steps']>[] : never;
} : {});
export type ThemeGetPayload<P extends {
    populate?: any;
} = {}> = Theme & (P extends {
    populate: infer Pop;
} ? Pop extends '*' | true ? {
    colors?: ThemeSemanticColors;
    typography?: ThemeTypography;
    spacing?: ThemeSpacing;
    layout?: ThemeLayout;
} : Pop extends readonly (infer _)[] ? {
    colors?: 'colors' extends Pop[number] ? ThemeSemanticColors : never;
    typography?: 'typography' extends Pop[number] ? ThemeTypography : never;
    spacing?: 'spacing' extends Pop[number] ? ThemeSpacing : never;
    layout?: 'layout' extends Pop[number] ? ThemeLayout : never;
} : {
    colors?: 'colors' extends keyof Pop ? _ApplyFields<ThemeSemanticColors, ThemeSemanticColors, Pop['colors']> : never;
    typography?: 'typography' extends keyof Pop ? _ApplyFields<ThemeTypography, ThemeTypography, Pop['typography']> : never;
    spacing?: 'spacing' extends keyof Pop ? _ApplyFields<ThemeSpacing, ThemeSpacing, Pop['spacing']> : never;
    layout?: 'layout' extends keyof Pop ? _ApplyFields<ThemeLayout, ThemeLayout, Pop['layout']> : never;
} : {});
/** String filter operators */
export interface StringFilterOperators {
    $eq?: string;
    $eqi?: string;
    $ne?: string;
    $nei?: string;
    $in?: string[];
    $notIn?: string[];
    $contains?: string;
    $notContains?: string;
    $containsi?: string;
    $notContainsi?: string;
    $startsWith?: string;
    $startsWithi?: string;
    $endsWith?: string;
    $endsWithi?: string;
    $null?: boolean;
    $notNull?: boolean;
}
/** Number filter operators */
export interface NumberFilterOperators {
    $eq?: number;
    $ne?: number;
    $lt?: number;
    $lte?: number;
    $gt?: number;
    $gte?: number;
    $in?: number[];
    $notIn?: number[];
    $between?: [number, number];
    $null?: boolean;
    $notNull?: boolean;
}
/** Boolean filter operators */
export interface BooleanFilterOperators {
    $eq?: boolean;
    $ne?: boolean;
    $null?: boolean;
    $notNull?: boolean;
}
/** Date filter operators (dates are strings in Strapi) */
export interface DateFilterOperators {
    $eq?: string;
    $ne?: string;
    $lt?: string;
    $lte?: string;
    $gt?: string;
    $gte?: string;
    $in?: string[];
    $notIn?: string[];
    $between?: [string, string];
    $null?: boolean;
    $notNull?: boolean;
}
/** ID filter operators (for relations) */
export interface IdFilterOperators {
    $eq?: number | string;
    $ne?: number | string;
    $in?: (number | string)[];
    $notIn?: (number | string)[];
    $null?: boolean;
    $notNull?: boolean;
}
/** Relation filter - filter by nested fields */
export type RelationFilter<T> = {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
} & {
    [K in keyof T]?: T[K] extends string ? string | StringFilterOperators : T[K] extends number ? number | NumberFilterOperators : T[K] extends boolean ? boolean | BooleanFilterOperators : any;
};
/** Logical operators for combining filters */
export interface LogicalOperators<T> {
    $and?: T[];
    $or?: T[];
    $not?: T;
}
/** Sort direction */
export type SortDirection = 'asc' | 'desc';
/** Sort option - can be a field name or field:direction */
export type SortOption<T> = (keyof T & string) | `${keyof T & string}:${SortDirection}`;
/** Typed query parameters */
export interface TypedQueryParams<TEntity, TFilters = Record<string, any>, TPopulate = any> {
    /** Type-safe filters */
    filters?: TFilters;
    /** Sort by field(s) */
    sort?: SortOption<TEntity> | SortOption<TEntity>[];
    /** Pagination options */
    pagination?: {
        page?: number;
        pageSize?: number;
        limit?: number;
        start?: number;
    };
    /** Populate relations */
    populate?: TPopulate;
    /** Select specific fields */
    fields?: (keyof TEntity)[];
}
/** Type-safe filters for Permission */
export interface PermissionFilters extends LogicalOperators<PermissionFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    action?: string | StringFilterOperators;
    role?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for Role */
export interface RoleFilters extends LogicalOperators<RoleFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    name?: string | StringFilterOperators;
    description?: string | StringFilterOperators;
    type?: string | StringFilterOperators;
    permissions?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
    users?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for User */
export interface UserFilters extends LogicalOperators<UserFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    username?: string | StringFilterOperators;
    email?: string | StringFilterOperators;
    provider?: string | StringFilterOperators;
    confirmed?: boolean | BooleanFilterOperators;
    blocked?: boolean | BooleanFilterOperators;
    role?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for Action */
export interface ActionFilters extends LogicalOperators<ActionFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    name?: string | StringFilterOperators;
}
/** Type-safe filters for BulletList */
export interface BulletListFilters extends LogicalOperators<BulletListFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    title?: string | StringFilterOperators;
}
/** Type-safe filters for Button */
export interface ButtonFilters extends LogicalOperators<ButtonFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    text?: string | StringFilterOperators;
    variant?: ('primary' | 'secondary' | 'tertiary') | StringFilterOperators;
    action?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for ContactForm */
export interface ContactFormFilters extends LogicalOperators<ContactFormFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    action?: ('contact' | 'consultation') | StringFilterOperators;
    submit_label?: string | StringFilterOperators;
    success_message?: string | StringFilterOperators;
    layout?: any;
}
/** Type-safe filters for Faq */
export interface FaqFilters extends LogicalOperators<FaqFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    title?: string | StringFilterOperators;
}
/** Type-safe filters for Footer */
export interface FooterFilters extends LogicalOperators<FooterFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    brand_heading?: string | StringFilterOperators;
    brand_tagline?: string | StringFilterOperators;
    brand_description?: string | StringFilterOperators;
    contact_email?: string | StringFilterOperators;
    contact_location?: string | StringFilterOperators;
    contact_service_area?: string | StringFilterOperators;
    copyright_company_name?: string | StringFilterOperators;
    navigation?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for Header */
export interface HeaderFilters extends LogicalOperators<HeaderFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    navigation?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for MediaMetadata */
export interface MediaMetadataFilters extends LogicalOperators<MediaMetadataFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    metadata?: any;
    Media?: {
        id?: number | IdFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for Navigation */
export interface NavigationFilters extends LogicalOperators<NavigationFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    name?: string | StringFilterOperators;
}
/** Type-safe filters for Page */
export interface PageFilters extends LogicalOperators<PageFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    title?: string | StringFilterOperators;
    slug?: string | StringFilterOperators;
    seo_description?: string | StringFilterOperators;
    custom_css?: string | StringFilterOperators;
    parent_page?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
    sub_pages?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
    page_template?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for PageTemplate */
export interface PageTemplateFilters extends LogicalOperators<PageTemplateFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    Template?: ('Default' | 'Gallery Page' | 'Blog Page') | StringFilterOperators;
    slug?: ('default_page' | 'gallery_page' | 'blog_page') | StringFilterOperators;
    pages?: {
        id?: number | IdFilterOperators;
        documentId?: string | StringFilterOperators;
        [key: string]: any;
    };
}
/** Type-safe filters for StepGroup */
export interface StepGroupFilters extends LogicalOperators<StepGroupFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    title?: string | StringFilterOperators;
    columns?: ('col-2' | 'col-3' | 'col-4' | 'col-5') | StringFilterOperators;
    cta_text?: string | StringFilterOperators;
    cta_link?: string | StringFilterOperators;
}
/** Type-safe filters for Theme */
export interface ThemeFilters extends LogicalOperators<ThemeFilters> {
    id?: number | IdFilterOperators;
    documentId?: string | StringFilterOperators;
    name?: string | StringFilterOperators;
    is_active?: boolean | BooleanFilterOperators;
}
export {};
