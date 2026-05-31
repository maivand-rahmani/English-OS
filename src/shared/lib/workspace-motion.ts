const workspaceEase = [0.22, 1, 0.36, 1] as const;

export function getWorkspaceShellMotion(reduced: boolean) {
  if (reduced) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.24, ease: workspaceEase },
  };
}

export function getWorkspaceRevealMotion(
  reduced: boolean,
  index = 0,
  distance = 14,
) {
  if (reduced) {
    return {};
  }

  return {
    initial: { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: index * 0.05,
      duration: 0.36,
      ease: workspaceEase,
    },
  };
}

export function getWorkspaceSwapMotion(reduced: boolean, distance = 10) {
  if (reduced) {
    return {};
  }

  return {
    initial: { opacity: 0, y: distance, scale: 0.985 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -distance, scale: 0.99 },
    transition: { duration: 0.2, ease: workspaceEase },
  };
}

export function getWorkspaceItemMotion(reduced: boolean, index = 0) {
  if (reduced) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: index * 0.03,
      duration: 0.24,
      ease: workspaceEase,
    },
  };
}
