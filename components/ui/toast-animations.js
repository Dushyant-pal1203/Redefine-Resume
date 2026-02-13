// components/ui/toast-animations.js
export const toastVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    filter: "blur(4px)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export const iconVariants = {
  initial: {
    scale: 0.5,
    rotate: -180,
    opacity: 0,
  },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
      delay: 0.1,
    },
  },
};
