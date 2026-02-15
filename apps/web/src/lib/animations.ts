/**
 * Framer Motion Animation Utilities
 * Shared animation patterns for proposal block components
 */

import { Variants, Transition } from 'framer-motion';

/**
 * Default transition used across all components for consistency
 */
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
};

/**
 * Wrap animation variants to respect prefers-reduced-motion.
 * Components using framer-motion's useReducedMotion() hook should pass
 * the result here to get static variants (no movement/opacity changes).
 */
export function motionSafe<T extends Variants>(variants: T, reducedMotion: boolean): T {
  if (!reducedMotion) return variants;
  // Return variants with no animation — just the final state immediately
  const safe = {} as Record<string, unknown>;
  for (const key of Object.keys(variants)) {
    if (key === 'initial') {
      safe[key] = {}; // no initial offset
    } else {
      const target = variants[key];
      if (typeof target === 'object' && target !== null) {
        const { transition, ...rest } = target as Record<string, unknown>;
        // Strip motion properties, keep layout
        const cleaned = { ...rest };
        delete cleaned.x;
        delete cleaned.y;
        delete cleaned.scale;
        cleaned.opacity = 1;
        cleaned.transition = { duration: 0 };
        safe[key] = cleaned;
      } else {
        safe[key] = target;
      }
    }
  }
  return safe as T;
}

/**
 * Fade in from bottom with customizable delay
 */
export const fadeInUp = (delay = 0): Variants => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay }
  }
});

/**
 * Fade in without motion
 */
export const fadeIn = (delay = 0): Variants => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, delay }
  }
});

/**
 * Scale animation (for icons, badges)
 */
export const scaleIn = (delay = 0): Variants => ({
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, delay, type: 'spring', stiffness: 200 }
  }
});

/**
 * Stagger children animation
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Child item for stagger container
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Slide in from left
 */
export const slideInLeft = (delay = 0): Variants => ({
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay }
  }
});

/**
 * Slide in from right
 */
export const slideInRight = (delay = 0): Variants => ({
  initial: { opacity: 0, x: 30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay }
  }
});

/**
 * Hover lift animation (for cards)
 */
export const hoverLift = {
  whileHover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 }
  }
};

/**
 * Hover scale (for buttons, icons)
 */
export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

/**
 * Default viewport settings for scroll animations
 */
export const defaultViewport = {
  once: true,
  margin: '0px 0px -100px 0px'
};
