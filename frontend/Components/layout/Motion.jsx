"use client";
/**
 * Reveal — Declarative Framer Motion scroll/mount animation wrapper.
 *
 * WHEN TO USE:
 *   - Animating any content into view on scroll (below-fold sections)
 *   - Hero/above-fold animations with trigger="mount"
 *   - Staggered list animations using the stagger prop
 *
 * WHEN NOT TO USE:
 *   - Interactive hover/tap animations → use Framer Motion directly
 *   - Layout/shared element transitions → use Framer Motion layout features
 *
 * COMPOSITION:
 *   PageLayout > Section > Container > Reveal > content
 *   PageLayout > Section > Container > InnerSection > Reveal > content
 *
 * @example
 * // Basic scroll reveal
 * <Reveal><Card /></Reveal>
 *
 * // Staggered list
 * {items.map((item, i) => (
 *   <Reveal key={item.id} stagger={i}>{item.name}</Reveal>
 * ))}
 *
 * // Hero animation (mount-triggered)
 * <Reveal trigger="mount" effect="fade-up" delay={0.2}>
 *   <h1>Heading</h1>
 * </Reveal>
 */
import { motion } from "framer-motion";
import { ANIMATIONS } from "../../lib/constants";

const buildPreset = (effect, distance) => {
  switch (effect) {
    case "fade-down":
      return { initial: { opacity: 0, y: -distance }, animate: { opacity: 1, y: 0 } };
    case "fade-left":
      return { initial: { opacity: 0, x: distance }, animate: { opacity: 1, x: 0 } };
    case "fade-right":
      return { initial: { opacity: 0, x: -distance }, animate: { opacity: 1, x: 0 } };
    case "fade-in":
      return { initial: { opacity: 0 }, animate: { opacity: 1 } };
    case "scale-in":
      return { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } };
    case "fade-up":
    default:
      return { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 } };
  }
};

export default function Reveal({
  children,
  as = "div",
  effect = "fade-up",
  delay = 0,
  duration = 0.9,
  distance = 40,
  stagger = false,
  trigger = "viewport",
  once = true,
  className,
  ...props
}) {
  const MotionTag = motion[as] ?? motion.div;
  const preset = buildPreset(effect, distance);
  const totalDelay =
    delay + (stagger !== false ? stagger * ANIMATIONS.STAGGER_DELAY : 0);
  const transition = {
    duration,
    delay: totalDelay,
    ease: ANIMATIONS.SOULS_TIMING,
  };

  if (trigger === "mount") {
    return (
      <MotionTag
        initial={preset.initial}
        animate={preset.animate}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={preset.initial}
      whileInView={preset.animate}
      viewport={{ once }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
