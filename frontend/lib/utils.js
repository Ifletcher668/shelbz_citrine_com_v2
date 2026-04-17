import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as csstree from "css-tree";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function sanitizeCSS(css) {
  try {
    const ast = csstree.parse(`:root {\n${css}\n}`, { parseError: true });

    csstree.walk(ast, (node) => {
      if (node.type === "Url") throw new Error("url() not allowed");
      if (node.type === "Atrule" && node.name === "import")
        throw new Error("@import not allowed");
    });

    // Serialize back to string (also minifies)
    return csstree.generate(ast);
  } catch {
    return null;
  }
}
