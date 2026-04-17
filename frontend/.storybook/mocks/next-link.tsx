import React from "react";

type LinkProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  [key: string]: unknown;
};

// Renders as a plain <a> tag in Storybook — no Next.js router needed.
export default function Link({ href, children, ...props }: LinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
