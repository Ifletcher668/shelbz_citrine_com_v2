import { createContext, useContext } from "react";

/**
 * Carries Strapi header data (nav links, logo) from build-time fetching in
 * _app.js down to the Header component without prop-drilling through every page.
 *
 * Value shape: the data object returned by getHeader(), or null if unavailable.
 */
export const HeaderDataContext = createContext(null);

export const useHeaderData = () => useContext(HeaderDataContext);
