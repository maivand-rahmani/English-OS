/**
 * Safely triggers a confetti burst. Dynamically imports canvas-confetti
 * to avoid SSR issues. Respects prefers-reduced-motion.
 */
export async function triggerConfetti() {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const confettiModule = await import('canvas-confetti');
  const confetti = confettiModule.default ?? confettiModule;
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
  });
}
