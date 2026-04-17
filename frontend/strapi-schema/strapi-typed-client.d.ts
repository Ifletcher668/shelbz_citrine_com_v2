// Schema types from our committed snapshot — the stable source of truth.
// When content types change, run `yarn generate:strapi-client-types` and commit the result.
export * from "./types";

import type { Permission, PermissionGetPayload, PermissionPopulateParam, PermissionInput, Role, RoleGetPayload, RolePopulateParam, RoleInput, User, UserGetPayload, UserPopulateParam, UserInput, Action, ActionInput, BulletList, BulletListGetPayload, BulletListPopulateParam, BulletListInput, Button, ButtonGetPayload, ButtonPopulateParam, ButtonInput, ContactForm, ContactFormGetPayload, ContactFormPopulateParam, ContactFormInput, Faq, FaqGetPayload, FaqPopulateParam, FaqInput, Footer, FooterGetPayload, FooterPopulateParam, FooterInput, Header, HeaderGetPayload, HeaderPopulateParam, HeaderInput, MediaMetadata, MediaMetadataGetPayload, MediaMetadataPopulateParam, MediaMetadataInput, Navigation, NavigationGetPayload, NavigationPopulateParam, NavigationInput, Page, PageGetPayload, PagePopulateParam, PageInput, PageTemplate, PageTemplateGetPayload, PageTemplatePopulateParam, PageTemplateInput, StepGroup, StepGroupGetPayload, StepGroupPopulateParam, StepGroupInput, Theme, ThemeGetPayload, ThemePopulateParam, ThemeInput } from './types';
import type { PermissionFilters, RoleFilters, UserFilters, ActionFilters, BulletListFilters, ButtonFilters, ContactFormFilters, FaqFilters, FooterFilters, HeaderFilters, MediaMetadataFilters, NavigationFilters, PageFilters, PageTemplateFilters, StepGroupFilters, ThemeFilters } from './types';
export interface StrapiResponse<T> {
    data: T;
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
/** Custom error class for Strapi API errors */
export declare class StrapiError extends Error {
    /** Clean user-friendly message from Strapi backend */
    userMessage: string;
    /** HTTP status code */
    status: number;
    /** HTTP status text */
    statusText: string;
    /** Additional error details from Strapi */
    details?: any;
    constructor(message: string, userMessage: string, status: number, statusText: string, details?: any);
}
/** Error thrown when the client cannot connect to Strapi (network failures, DNS, timeouts) */
export declare class StrapiConnectionError extends Error {
    /** The URL that was being requested */
    url: string;
    /** The original error that caused the connection failure */
    cause?: Error;
    constructor(message: string, url: string, cause?: Error);
}
declare class BaseAPI {
    protected config: StrapiClientConfig;
    constructor(config: StrapiClientConfig);
    private getErrorHint;
    protected request<R>(url: string, options?: RequestInit, nextOptions?: NextOptions, errorPrefix?: string): Promise<R>;
    protected buildQueryString(params?: QueryParams): string;
}
type StrapiSortOption<T> = Exclude<keyof T & string, '__typename'> | `${Exclude<keyof T & string, '__typename'>}:${'asc' | 'desc'}`;
export interface QueryParams<TEntity = any, TFilters = Record<string, any>, TPopulate = any, TFields extends string = Exclude<keyof TEntity & string, '__typename'>> {
    filters?: TFilters;
    sort?: StrapiSortOption<TEntity> | StrapiSortOption<TEntity>[];
    pagination?: {
        page?: number;
        pageSize?: number;
        limit?: number;
        start?: number;
    };
    populate?: TPopulate;
    fields?: TFields[];
    locale?: string;
    status?: 'draft' | 'published';
}
export interface NextOptions {
    revalidate?: number | false;
    tags?: string[];
    cache?: RequestCache;
    headers?: Record<string, string | undefined>;
}
export interface StrapiClientConfig {
    baseURL: string;
    token?: string;
    fetch?: typeof fetch;
    debug?: boolean;
    credentials?: RequestCredentials;
    /** Request timeout in milliseconds. When set, requests that take longer will be aborted. */
    timeout?: number;
    /** Enable schema validation on init (dev mode). Logs warning if types are outdated. */
    validateSchema?: boolean;
}
/** Utility type for exact type equality check */
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type GetPopulated<TBase, TPopulate> = Equal<TBase, Permission> extends true ? PermissionGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Role> extends true ? RoleGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, User> extends true ? UserGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, BulletList> extends true ? BulletListGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Button> extends true ? ButtonGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, ContactForm> extends true ? ContactFormGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Faq> extends true ? FaqGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Footer> extends true ? FooterGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Header> extends true ? HeaderGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, MediaMetadata> extends true ? MediaMetadataGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Navigation> extends true ? NavigationGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Page> extends true ? PageGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, PageTemplate> extends true ? PageTemplateGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, StepGroup> extends true ? StepGroupGetPayload<{
    populate: TPopulate;
}> : Equal<TBase, Theme> extends true ? ThemeGetPayload<{
    populate: TPopulate;
}> : TBase;
/** Utility type for narrowing return type based on fields parameter */
type SelectFields<TFull, TBase, TFields extends string> = [TFields] extends [never] ? TFull : Pick<TBase, Extract<TFields | 'id' | 'documentId', keyof TBase>> & Omit<TFull, keyof TBase>;
export interface LoginCredentials {
    identifier: string;
    password: string;
}
export interface RegisterData {
    username: string;
    email: string;
    password: string;
    referralCode?: string;
    referralSource?: 'code' | 'link' | 'share';
}
export interface AuthResponse {
    jwt: string;
    user: User;
}
export interface ForgotPasswordData {
    email: string;
}
export interface ResetPasswordData {
    code: string;
    password: string;
    passwordConfirmation: string;
}
export interface ChangePasswordData {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}
export interface EmailConfirmationResponse {
    jwt: string;
    user: User;
}
declare class CollectionAPI<TBase, TInput = Partial<TBase>, TFilters = Record<string, any>, TPopulateKeys extends Record<string, any> = Record<string, any>> extends BaseAPI {
    private endpoint;
    constructor(endpoint: string, config: StrapiClientConfig);
    find<const TPopulate extends TPopulateKeys, const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>;
    find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: '*' | true;
    } & QueryParams<TBase, TFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>[]>;
    find<const TPopulate extends readonly (keyof TPopulateKeys & string)[], const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>;
    find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params?: QueryParams<TBase, TFilters, TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<SelectFields<TBase, TBase, TFields>[]>;
    findWithMeta<const TPopulate extends TPopulateKeys, const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>>;
    findWithMeta<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: '*' | true;
    } & QueryParams<TBase, TFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>[]>>;
    findWithMeta<const TPopulate extends readonly (keyof TPopulateKeys & string)[], const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<StrapiResponse<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>[]>>;
    findWithMeta<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params?: QueryParams<TBase, TFilters, TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<StrapiResponse<SelectFields<TBase, TBase, TFields>[]>>;
    findOne<const TPopulate extends TPopulateKeys, const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(documentId: string, params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields> | null>;
    findOne<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(documentId: string, params: {
        populate: '*' | true;
    } & QueryParams<TBase, TFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields> | null>;
    findOne<const TPopulate extends readonly (keyof TPopulateKeys & string)[], const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(documentId: string, params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields> | null>;
    findOne<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(documentId: string, params?: QueryParams<TBase, TFilters, TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<SelectFields<TBase, TBase, TFields> | null>;
    create(data: TInput | FormData, nextOptions?: NextOptions): Promise<TBase>;
    update(documentId: string, data: TInput | FormData, nextOptions?: NextOptions): Promise<TBase>;
    delete(documentId: string, nextOptions?: NextOptions): Promise<TBase | null>;
}
declare class SingleTypeAPI<TBase, TInput = Partial<TBase>, TFilters = Record<string, any>, TPopulateKeys extends Record<string, any> = Record<string, any>> extends BaseAPI {
    private endpoint;
    constructor(endpoint: string, config: StrapiClientConfig);
    find<const TPopulate extends TPopulateKeys, const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>>;
    find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: '*' | true;
    } & QueryParams<TBase, TFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, '*'>, TBase, TFields>>;
    find<const TPopulate extends readonly (keyof TPopulateKeys & string)[], const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<TBase, TFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<TBase, TPopulate>, TBase, TFields>>;
    find<const TFields extends Exclude<keyof TBase & string, '__typename'> = never>(params?: QueryParams<TBase, TFilters, TPopulateKeys | (keyof TPopulateKeys & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<SelectFields<TBase, TBase, TFields>>;
    update(data: TInput | FormData, nextOptions?: NextOptions): Promise<TBase>;
}
declare class AuthAPI extends BaseAPI {
    constructor(config: StrapiClientConfig);
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(data: RegisterData): Promise<AuthResponse>;
    me<const TPopulate extends UserPopulateParam, const TFields extends Exclude<keyof User & string, '__typename'> = never>(params: {
        populate: TPopulate;
    } & QueryParams<User, UserFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<User, TPopulate>, User, TFields>>;
    me<const TFields extends Exclude<keyof User & string, '__typename'> = never>(params: {
        populate: '*' | true;
    } & QueryParams<User, UserFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<User, '*'>, User, TFields>>;
    me<const TFields extends Exclude<keyof User & string, '__typename'> = never>(params?: QueryParams<User, UserFilters, UserPopulateParam | (keyof UserPopulateParam & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<SelectFields<User, User, TFields>>;
    updateMe<const TPopulate extends UserPopulateParam, const TFields extends Exclude<keyof User & string, '__typename'> = never>(data: Partial<User>, params: {
        populate: TPopulate;
    } & QueryParams<User, UserFilters, TPopulate, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<User, TPopulate>, User, TFields>>;
    updateMe<const TFields extends Exclude<keyof User & string, '__typename'> = never>(data: Partial<User>, params: {
        populate: '*' | true;
    } & QueryParams<User, UserFilters, '*' | true, TFields>, nextOptions?: NextOptions): Promise<SelectFields<GetPopulated<User, '*'>, User, TFields>>;
    updateMe<const TFields extends Exclude<keyof User & string, '__typename'> = never>(data: Partial<User>, params?: QueryParams<User, UserFilters, UserPopulateParam | (keyof UserPopulateParam & string)[] | '*' | boolean, TFields>, nextOptions?: NextOptions): Promise<SelectFields<User, User, TFields>>;
    callback(provider: string, search?: string, nextOptions?: NextOptions): Promise<AuthResponse>;
    logout(): Promise<void>;
    forgotPassword(data: ForgotPasswordData): Promise<{ ok: boolean; }>;
    resetPassword(data: ResetPasswordData): Promise<AuthResponse>;
    changePassword(data: ChangePasswordData): Promise<AuthResponse>;
    confirmEmail(confirmationToken: string, nextOptions?: NextOptions): Promise<EmailConfirmationResponse>;
    sendEmailConfirmation(email: string): Promise<{ ok: boolean; }>;
}
export declare class StrapiClient {
    private config;
    authentication: AuthAPI;
    permissions: CollectionAPI<Permission, PermissionInput, PermissionFilters, PermissionPopulateParam>;
    roles: CollectionAPI<Role, RoleInput, RoleFilters, RolePopulateParam>;
    users: CollectionAPI<User, UserInput, UserFilters, UserPopulateParam>;
    actions: CollectionAPI<Action, ActionInput, ActionFilters>;
    bulletLists: CollectionAPI<BulletList, BulletListInput, BulletListFilters, BulletListPopulateParam>;
    buttons: CollectionAPI<Button, ButtonInput, ButtonFilters, ButtonPopulateParam>;
    contactForms: CollectionAPI<ContactForm, ContactFormInput, ContactFormFilters, ContactFormPopulateParam>;
    faqs: CollectionAPI<Faq, FaqInput, FaqFilters, FaqPopulateParam>;
    footer: SingleTypeAPI<Footer, FooterInput, FooterFilters, FooterPopulateParam>;
    header: SingleTypeAPI<Header, HeaderInput, HeaderFilters, HeaderPopulateParam>;
    mediasMetadata: CollectionAPI<MediaMetadata, MediaMetadataInput, MediaMetadataFilters, MediaMetadataPopulateParam>;
    navigations: CollectionAPI<Navigation, NavigationInput, NavigationFilters, NavigationPopulateParam>;
    pages: CollectionAPI<Page, PageInput, PageFilters, PagePopulateParam>;
    pageTemplates: CollectionAPI<PageTemplate, PageTemplateInput, PageTemplateFilters, PageTemplatePopulateParam>;
    stepGroups: CollectionAPI<StepGroup, StepGroupInput, StepGroupFilters, StepGroupPopulateParam>;
    themes: CollectionAPI<Theme, ThemeInput, ThemeFilters, ThemePopulateParam>;
    constructor(config: StrapiClientConfig);
    setToken(token: string): void;
    validateSchema(): Promise<{
        valid: boolean;
        localHash: string;
        remoteHash?: string;
        error?: string;
    }>;
}
export {};
