import { createContext, useContext } from "react";

export const MediaContext = createContext({});

export function useStrapiMedia() {
  return useContext(MediaContext);
}
