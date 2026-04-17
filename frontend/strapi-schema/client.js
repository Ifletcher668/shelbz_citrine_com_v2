import qs from 'qs';
/** Custom error class for Strapi API errors */
export class StrapiError extends Error {
    /** Clean user-friendly message from Strapi backend */
    userMessage;
    /** HTTP status code */
    status;
    /** HTTP status text */
    statusText;
    /** Additional error details from Strapi */
    details;
    constructor(message, userMessage, status, statusText, details) {
        super(message);
        this.name = 'StrapiError';
        this.userMessage = userMessage;
        this.status = status;
        this.statusText = statusText;
        this.details = details;
    }
}
/** Error thrown when the client cannot connect to Strapi (network failures, DNS, timeouts) */
export class StrapiConnectionError extends Error {
    /** The URL that was being requested */
    url;
    /** The original error that caused the connection failure */
    cause;
    constructor(message, url, cause) {
        super(message);
        this.name = 'StrapiConnectionError';
        this.url = url;
        this.cause = cause;
    }
}
// Base API class with shared logic
class BaseAPI {
    config;
    constructor(config) {
        this.config = config;
    }
    getErrorHint(status) {
        switch (status) {
            case 401:
                return ' Hint: check that your API token is valid and passed to StrapiClient config.';
            case 403:
                return ' Hint: your token may lack permissions for this endpoint. Check Strapi roles & permissions.';
            case 404:
                return ' Hint: this endpoint may not exist. Verify the content type is created in Strapi and the API is enabled.';
            case 500:
                return ' Hint: internal Strapi error. Check Strapi server logs for details.';
            default:
                return '';
        }
    }
    async request(url, options = {}, nextOptions, errorPrefix = 'Strapi API') {
        const fetchFn = this.config.fetch || globalThis.fetch;
        if (this.config.debug) {
            console.log(`[${errorPrefix}] ${options.method || 'GET'} ${url}`);
        }
        const headers = {
            ...options.headers,
        };
        // Only add Content-Type for JSON, let browser set it for FormData
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
        if (this.config.token) {
            headers['Authorization'] = `Bearer ${this.config.token}`;
        }
        // Merge custom headers from nextOptions
        if (nextOptions?.headers) {
            for (const [key, value] of Object.entries(nextOptions.headers)) {
                if (value !== undefined) {
                    headers[key] = value;
                }
            }
        }
        const fetchOptions = {
            ...options,
            headers,
            ...(this.config.credentials && { credentials: this.config.credentials }),
        };
        // Add Next.js cache options if provided
        if (nextOptions) {
            if (nextOptions.revalidate !== undefined || nextOptions.tags) {
                fetchOptions.next = {
                    ...(nextOptions.revalidate !== undefined && { revalidate: nextOptions.revalidate }),
                    ...(nextOptions.tags && { tags: nextOptions.tags }),
                };
            }
            if (nextOptions.cache) {
                fetchOptions.cache = nextOptions.cache;
            }
        }
        // Timeout support via AbortController
        let timeoutId;
        if (this.config.timeout) {
            const controller = new AbortController();
            fetchOptions.signal = controller.signal;
            timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        }
        let response;
        try {
            response = await fetchFn(url, fetchOptions);
        }
        catch (error) {
            if (timeoutId)
                clearTimeout(timeoutId);
            const baseURL = this.config.baseURL;
            const msg = error?.message || String(error);
            // Timeout (AbortController abort)
            if (error?.name === 'AbortError') {
                throw new StrapiConnectionError(`Request timed out after ${this.config.timeout}ms. URL: ${url}`, url, error);
            }
            // Connection refused
            if (msg.includes('ECONNREFUSED')) {
                throw new StrapiConnectionError(`Could not connect to Strapi at ${baseURL}. Is the server running?`, url, error);
            }
            // DNS resolution failure
            if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) {
                throw new StrapiConnectionError(`Could not resolve host. Check your baseURL: ${baseURL}`, url, error);
            }
            // Generic network error
            throw new StrapiConnectionError(`Network error: ${msg}. Check your baseURL: ${baseURL}`, url, error);
        }
        finally {
            if (timeoutId)
                clearTimeout(timeoutId);
        }
        if (!response.ok) {
            // Detect HTML response (wrong server / reverse proxy error page)
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
                throw new StrapiError(`Strapi returned HTML instead of JSON. Your baseURL may point to the wrong server. URL: ${url}`, 'Unexpected HTML response from server', response.status, response.statusText);
            }
            const errorData = await response.json().catch(() => ({}));
            const userMessage = errorData.error?.message || response.statusText;
            const hint = this.getErrorHint(response.status);
            const technicalMessage = `${errorPrefix} error: ${response.status} ${response.statusText}${errorData.error?.message ? ' - ' + errorData.error.message : ''}${hint}`;
            throw new StrapiError(technicalMessage, userMessage, response.status, response.statusText, errorData.error?.details);
        }
        // Handle 204 No Content (e.g., from DELETE operations)
        if (response.status === 204) {
            return null;
        }
        return response.json();
    }
    buildQueryString(params) {
        if (!params)
            return '';
        const queryString = qs.stringify(params, {
            encodeValuesOnly: true,
            skipNulls: true,
        });
        return queryString ? `?${queryString}` : '';
    }
}
// Collection API wrapper with type-safe populate support
class CollectionAPI extends BaseAPI {
    endpoint;
    constructor(endpoint, config) {
        super(config);
        this.endpoint = endpoint;
    }
    async find(params, nextOptions) {
        const query = this.buildQueryString(params);
        const url = `${this.config.baseURL}/api/${this.endpoint}${query}`;
        const response = await this.request(url, {}, nextOptions);
        return response.data;
    }
    async findWithMeta(params, nextOptions) {
        const query = this.buildQueryString(params);
        const url = `${this.config.baseURL}/api/${this.endpoint}${query}`;
        return this.request(url, {}, nextOptions);
    }
    async findOne(documentId, params, nextOptions) {
        const query = this.buildQueryString(params);
        const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}${query}`;
        const response = await this.request(url, {}, nextOptions);
        return response.data;
    }
    async create(data, nextOptions) {
        // If data is FormData, use it directly; otherwise wrap in { data } and JSON stringify
        const body = data instanceof FormData ? data : JSON.stringify({ data });
        const url = `${this.config.baseURL}/api/${this.endpoint}`;
        const response = await this.request(url, {
            method: 'POST',
            body,
        }, nextOptions);
        return response.data;
    }
    async update(documentId, data, nextOptions) {
        // If data is FormData, use it directly; otherwise wrap in { data } and JSON stringify
        const body = data instanceof FormData ? data : JSON.stringify({ data });
        const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}`;
        const response = await this.request(url, {
            method: 'PUT',
            body,
        }, nextOptions);
        return response.data;
    }
    async delete(documentId, nextOptions) {
        const url = `${this.config.baseURL}/api/${this.endpoint}/${documentId}`;
        const response = await this.request(url, {
            method: 'DELETE',
        }, nextOptions);
        return response?.data ?? null;
    }
}
// Single Type API wrapper with type-safe populate support
class SingleTypeAPI extends BaseAPI {
    endpoint;
    constructor(endpoint, config) {
        super(config);
        this.endpoint = endpoint;
    }
    async find(params, nextOptions) {
        const query = this.buildQueryString(params);
        const url = `${this.config.baseURL}/api/${this.endpoint}${query}`;
        const response = await this.request(url, {}, nextOptions);
        return response.data;
    }
    async update(data, nextOptions) {
        // If data is FormData, use it directly; otherwise wrap in { data } and JSON stringify
        const body = data instanceof FormData ? data : JSON.stringify({ data });
        const url = `${this.config.baseURL}/api/${this.endpoint}`;
        const response = await this.request(url, {
            method: 'PUT',
            body,
        }, nextOptions);
        return response.data;
    }
}
// Auth API wrapper for users-permissions plugin
class AuthAPI extends BaseAPI {
    constructor(config) {
        super(config);
    }
    /**
     * Login with email/username and password
     * POST /api/auth/local
     */
    async login(credentials) {
        const url = `${this.config.baseURL}/api/auth/local`;
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(credentials),
        }, undefined, 'Strapi Auth');
    }
    /**
     * Register a new user
     * POST /api/auth/local/register
     */
    async register(data) {
        const url = `${this.config.baseURL}/api/auth/local/register`;
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }, undefined, 'Strapi Auth');
    }
    async me(params, nextOptions) {
        const queryString = params ? this.buildQueryString(params) : '';
        const url = queryString
            ? `${this.config.baseURL}/api/users/me${queryString}`
            : `${this.config.baseURL}/api/users/me`;
        const response = await this.request(url, {}, nextOptions, 'Strapi Auth');
        return response;
    }
    async updateMe(data, params, nextOptions) {
        const queryString = params ? this.buildQueryString(params) : '';
        const url = queryString
            ? `${this.config.baseURL}/api/users/me${queryString}`
            : `${this.config.baseURL}/api/users/me`;
        const response = await this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        }, nextOptions, 'Strapi Auth');
        return response;
    }
    /**
     * OAuth callback
     * GET /api/auth/:provider/callback
     * @param provider - OAuth provider name (google, github, etc.)
     * @param search - Query string (e.g., "access_token=xxx&code=yyy" or "?access_token=xxx")
     */
    async callback(provider, search, nextOptions) {
        let path = `/api/auth/${provider}/callback`;
        if (search) {
            // Add search string, handling both "?key=val" and "key=val" formats
            path += search.startsWith('?') ? search : `?${search}`;
        }
        const url = `${this.config.baseURL}${path}`;
        return this.request(url, {}, nextOptions, 'Strapi Auth');
    }
    /**
     * Logout current user (client-side token removal helper)
     */
    async logout() {
        this.config.token = undefined;
    }
    /**
     * Request password reset email
     * POST /api/auth/forgot-password
     */
    async forgotPassword(data) {
        const url = `${this.config.baseURL}/api/auth/forgot-password`;
        await this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }, undefined, 'Strapi Auth');
        return { ok: true };
    }
    /**
     * Reset password using reset code
     * POST /api/auth/reset-password
     */
    async resetPassword(data) {
        const url = `${this.config.baseURL}/api/auth/reset-password`;
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }, undefined, 'Strapi Auth');
    }
    /**
     * Change password for authenticated user
     * POST /api/auth/change-password
     */
    async changePassword(data) {
        const url = `${this.config.baseURL}/api/auth/change-password`;
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }, undefined, 'Strapi Auth');
    }
    /**
     * Confirm user email address
     * GET /api/auth/email-confirmation?confirmation=TOKEN
     */
    async confirmEmail(confirmationToken, nextOptions) {
        const url = `${this.config.baseURL}/api/auth/email-confirmation?confirmation=${confirmationToken}`;
        return this.request(url, {}, nextOptions, 'Strapi Auth');
    }
    /**
     * Send email confirmation
     * POST /api/auth/send-email-confirmation
     */
    async sendEmailConfirmation(email) {
        const url = `${this.config.baseURL}/api/auth/send-email-confirmation`;
        await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ email }),
        }, undefined, 'Strapi Auth');
        return { ok: true };
    }
}
// Main Strapi client
export class StrapiClient {
    config;
    // Auth API for users-permissions plugin
    authentication;
    permissions;
    roles;
    users;
    actions;
    bulletLists;
    buttons;
    contactForms;
    faqs;
    footer;
    header;
    mediasMetadata;
    navigations;
    pages;
    pageTemplates;
    stepGroups;
    themes;
    constructor(config) {
        this.config = config;
        // Initialize Auth API
        this.authentication = new AuthAPI(this.config);
        this.permissions = new CollectionAPI('users-permissions/permissions', this.config);
        this.roles = new CollectionAPI('users-permissions/roles', this.config);
        this.users = new CollectionAPI('users-permissions/users', this.config);
        this.actions = new CollectionAPI('actions', this.config);
        this.bulletLists = new CollectionAPI('bullet-lists', this.config);
        this.buttons = new CollectionAPI('buttons', this.config);
        this.contactForms = new CollectionAPI('contact-forms', this.config);
        this.faqs = new CollectionAPI('faqs', this.config);
        this.footer = new SingleTypeAPI('footer', this.config);
        this.header = new SingleTypeAPI('header', this.config);
        this.mediasMetadata = new CollectionAPI('medias-metadata', this.config);
        this.navigations = new CollectionAPI('navigations', this.config);
        this.pages = new CollectionAPI('pages', this.config);
        this.pageTemplates = new CollectionAPI('page-templates', this.config);
        this.stepGroups = new CollectionAPI('step-groups', this.config);
        this.themes = new CollectionAPI('themes', this.config);
        // Auto-validate schema in development mode
        if (config.validateSchema) {
            this.validateSchema()
                .then((result) => {
                if (!result.valid && result.remoteHash) {
                    console.warn(`[Strapi Types] Schema mismatch detected!`);
                    console.warn(`  Local:  ${result.localHash.slice(0, 8)}...`);
                    console.warn(`  Remote: ${result.remoteHash.slice(0, 8)}...`);
                    console.warn('  Run "npx strapi-types generate" to update types.');
                }
            })
                .catch(() => {
                // Silently ignore validation errors (e.g., plugin not installed)
            });
        }
    }
    setToken(token) {
        this.config.token = token;
    }
    /**
     * Validate that local types match the remote Strapi schema.
     * Useful for detecting schema drift in development.
     * @returns Promise<{ valid: boolean; localHash: string; remoteHash?: string; error?: string }>
     */
    async validateSchema() {
        try {
            const { SCHEMA_HASH } = await import('./schema-meta.js');
            const response = await fetch(`${this.config.baseURL}/api/strapi-types/schema-hash`);
            if (!response.ok) {
                return {
                    valid: false,
                    localHash: SCHEMA_HASH,
                    error: `Failed to fetch remote schema: ${response.status}`,
                };
            }
            const { hash: remoteHash } = await response.json();
            const valid = SCHEMA_HASH === remoteHash;
            if (!valid && this.config.debug) {
                console.warn(`[Strapi Types] Schema mismatch! Local: ${SCHEMA_HASH.slice(0, 8)}... Remote: ${remoteHash.slice(0, 8)}...`);
                console.warn('[Strapi Types] Run "npx strapi-types generate" to update types.');
            }
            return { valid, localHash: SCHEMA_HASH, remoteHash };
        }
        catch (error) {
            return {
                valid: false,
                localHash: 'unknown',
                error: error.message,
            };
        }
    }
}
