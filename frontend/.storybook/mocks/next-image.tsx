import React from "react";

type ImageProps = {
  src: string | { src: string };
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  [key: string]: unknown;
};

// Renders as a plain <img> tag in Storybook — no Next.js image optimization.
export default function Image({
  src,
  alt,
  width,
  height,
  className,
  fill,
  style,
  ...props
}: ImageProps) {
  const resolvedSrc = typeof src === "object" ? src.src : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={fill ? { objectFit: "cover", width: "100%", height: "100%", ...style } : style}
      {...props}
    />
  );
}
