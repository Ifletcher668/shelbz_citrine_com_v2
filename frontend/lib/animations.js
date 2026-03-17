/**
 * Animation Utilities for Framer Motion
 *
 * Provides consistent, reusable animation variants following the
 * Souls-like design philosophy: precise, fast, deliberate.
 *
 * @example
 * import { fadeInUp, SOULS_TIMING } from '@/lib/animations';
 *
 * <motion.div {...fadeInUp(0.2)}>Content</motion.div>
 */

import { ANIMATIONS } from './constants';

// ============================================
// Timing Functions
// ============================================

/**
 * Standard easing curves for animations
 */
export const SOULS_TIMING = ANIMATIONS.SOULS_TIMING;
export const SHARP_TIMING = ANIMATIONS.SHARP_TIMING;
export const SMOOTH_TIMING = ANIMATIONS.SMOOTH_TIMING;

// ============================================
// Common Animation Variants
// ============================================

/**
 * Fade in from opacity 0 to 1
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @returns {object} Framer Motion animation props
 */
export const fadeIn = (delay = 0, duration = 0.8) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Fade in while sliding up from below
 * Most common animation for content reveals
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} distance - Distance to slide (pixels)
 * @returns {object} Framer Motion animation props
 */
export const fadeInUp = (delay = 0, duration = 0.9, distance = 60) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Fade in while sliding down from above
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} distance - Distance to slide (pixels)
 * @returns {object} Framer Motion animation props
 */
export const fadeInDown = (delay = 0, duration = 0.9, distance = 60) => ({
  initial: { opacity: 0, y: -distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Fade in while sliding left from right
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} distance - Distance to slide (pixels)
 * @returns {object} Framer Motion animation props
 */
export const fadeInLeft = (delay = 0, duration = 0.9, distance = 60) => ({
  initial: { opacity: 0, x: distance },
  animate: { opacity: 1, x: 0 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Fade in while sliding right from left
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} distance - Distance to slide (pixels)
 * @returns {object} Framer Motion animation props
 */
export const fadeInRight = (delay = 0, duration = 0.9, distance = 60) => ({
  initial: { opacity: 0, x: -distance },
  animate: { opacity: 1, x: 0 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Scale up from 0 to 1 while fading in
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @returns {object} Framer Motion animation props
 */
export const scaleIn = (delay = 0, duration = 0.6) => ({
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration, delay, ease: SOULS_TIMING },
});

/**
 * Slide up without fade (for drawers, menus)
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @param {number} distance - Distance to slide (pixels)
 * @returns {object} Framer Motion animation props
 */
export const slideUp = (delay = 0, duration = 0.6, distance = 60) => ({
  initial: { y: distance },
  animate: { y: 0 },
  transition: { duration, delay, ease: SHARP_TIMING },
});

/**
 * Slide in from right (for mobile menus, drawers)
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {number} duration - Animation duration (seconds)
 * @returns {object} Framer Motion animation props
 */
export const slideInRight = (delay = 0, duration = 0.6) => ({
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
  transition: {
    type: "tween",
    duration,
    delay,
    ease: SOULS_TIMING
  },
});

/**
 * Stagger animation for lists
 * Use with Framer Motion's staggerChildren
 * @param {number} staggerDelay - Delay between each child (seconds)
 * @param {number} initialDelay - Delay before first child (seconds)
 * @returns {object} Framer Motion stagger config
 */
export const staggerContainer = (staggerDelay = ANIMATIONS.STAGGER_DELAY, initialDelay = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

/**
 * Child item for staggered lists
 * @returns {object} Framer Motion animation props
 */
export const staggerItem = () => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: SOULS_TIMING },
});

// ============================================
// Viewport Animation Variants
// ============================================

/**
 * Fade in when element enters viewport
 * Use with whileInView prop
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {boolean} once - Only animate once (default: true)
 * @returns {object} Framer Motion viewport animation props
 */
export const fadeInViewport = (delay = 0, once = true) => ({
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once, amount: 0.3 },
  transition: { duration: 0.9, delay, ease: SOULS_TIMING },
});

/**
 * Scale in when element enters viewport
 * @param {number} delay - Delay before animation starts (seconds)
 * @param {boolean} once - Only animate once (default: true)
 * @returns {object} Framer Motion viewport animation props
 */
export const scaleInViewport = (delay = 0, once = true) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once, amount: 0.3 },
  transition: { duration: 0.8, delay, ease: SOULS_TIMING },
});

// ============================================
// Hover/Interaction Animations
// ============================================

/**
 * Subtle scale up on hover
 * @param {number} scale - Scale multiplier (default: 1.02)
 * @returns {object} Framer Motion hover props
 */
export const hoverScale = (scale = 1.02) => ({
  whileHover: {
    scale,
    transition: { duration: 0.2, ease: SHARP_TIMING }
  },
});

/**
 * Lift up on hover with shadow
 * @param {number} distance - Distance to lift (pixels)
 * @returns {object} Framer Motion hover props
 */
export const hoverLift = (distance = -4) => ({
  whileHover: {
    y: distance,
    transition: { duration: 0.2, ease: SHARP_TIMING }
  },
});

/**
 * Button press animation
 * @returns {object} Framer Motion tap props
 */
export const tapScale = () => ({
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
});

// ============================================
// Page Transitions
// ============================================

/**
 * Page fade transition
 * Use with AnimatePresence
 * @returns {object} Framer Motion page transition props
 */
export const pageTransition = () => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: SMOOTH_TIMING },
});

/**
 * Page slide transition
 * @param {"left"|"right"|"up"|"down"} direction - Slide direction
 * @returns {object} Framer Motion page transition props
 */
export const pageSlide = (direction = "right") => {
  const variants = {
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    up: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
    down: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  return {
    ...variants[direction],
    transition: { duration: 0.4, ease: SOULS_TIMING },
  };
};

// ============================================
// Utility Functions
// ============================================

/**
 * Create custom transition config
 * @param {number} duration - Duration in seconds
 * @param {number} delay - Delay in seconds
 * @param {Array<number>} ease - Cubic bezier easing
 * @returns {object} Transition configuration
 */
export const customTransition = (
  duration = 0.6,
  delay = 0,
  ease = SOULS_TIMING
) => ({
  duration,
  delay,
  ease,
});

/**
 * Spring transition (for playful animations)
 * @param {number} stiffness - Spring stiffness (default: 100)
 * @param {number} damping - Spring damping (default: 10)
 * @returns {object} Spring configuration
 */
export const springTransition = (stiffness = 100, damping = 10) => ({
  type: "spring",
  stiffness,
  damping,
});
