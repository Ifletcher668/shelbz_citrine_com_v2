import { createContext, useContext } from "react";

/**
 * Carries Strapi footer data (copy text) from build-time fetching in
 * _app.js down to the Footer component without prop-drilling through every page.
 *
 * Value shape: the data object returned by getFooter(), or null if unavailable.
 */
export const FooterDataContext = createContext(null);

export const useFooterData = () => useContext(FooterDataContext);
