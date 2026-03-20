import { createContext, useContext } from "react";

/**
 * Carries pre-rendered relation HTML strings down to RichContent without
 * prop-drilling through DynamicZone and section components.
 *
 * Value shape: Record<"type:id", string>  e.g. { "bullet-list:42": "<div>...</div>" }
 * Defaults to {} so RichContent degrades gracefully when no provider is present.
 */
export const RelationsContext = createContext({});

export const useRelations = () => useContext(RelationsContext);
