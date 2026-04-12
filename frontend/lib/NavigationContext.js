import { createContext, useContext } from "react";

/**
 * Carries Strapi navigation data (nav links, logo, CTA) from build-time fetching
 * in _app.js down to any component that needs it, without prop-drilling.
 *
 * Value shape: the data object returned by getHeader(), or null if unavailable.
 */
export const NavigationContext = createContext(null);

export const useNavigation = () => useContext(NavigationContext);
