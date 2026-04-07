import { createContext, useContext } from "react";

export const MediaContext = createContext({});

export function useMediaMap() {
  return useContext(MediaContext);
}
