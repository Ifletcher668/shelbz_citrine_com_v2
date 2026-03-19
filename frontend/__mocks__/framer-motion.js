/**
 * Manual framer-motion mock.
 *
 * Renders motion.* elements as plain HTML elements, strips animation props so
 * React doesn't warn about unknown DOM attributes, and stubs out hooks that
 * rely on browser layout APIs not available in jsdom.
 */
const React = require('react');

const ANIMATION_PROPS = new Set([
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileDrag',
  'whileInView',
  'viewport',
  'layout',
  'layoutId',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'onDrag',
  'onDragStart',
  'onDragEnd',
  'onAnimationStart',
  'onAnimationComplete',
  'custom',
]);

function createMotionComponent(tag) {
  const Component = React.forwardRef(function MotionComponent(props, ref) {
    const { children, ...rest } = props;
    const filtered = {};
    for (const [key, val] of Object.entries(rest)) {
      if (!ANIMATION_PROPS.has(key)) {
        filtered[key] = val;
      }
    }
    return React.createElement(tag, { ...filtered, ref }, children);
  });
  Component.displayName = `motion.${tag}`;
  return Component;
}

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      return createMotionComponent(tag);
    },
  }
);

function AnimatePresence({ children }) {
  return children ?? null;
}

function useInView() {
  return true;
}

function useAnimation() {
  return { start: () => {}, stop: () => {}, set: () => {} };
}

module.exports = { motion, AnimatePresence, useInView, useAnimation };
