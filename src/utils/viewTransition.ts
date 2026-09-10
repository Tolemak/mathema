// TypeScript's bundled DOM lib only gained View Transition API types in a
// newer release than this project's pinned TS version ships - declared
// locally rather than bumping TypeScript just for this.
interface DocumentWithViewTransitions extends Document {
  startViewTransition(callback: () => void): { ready: Promise<void> };
}

export function radialViewTransition(originX: number, originY: number, apply: () => void) {
  const doc = typeof document !== 'undefined' ? (document as DocumentWithViewTransitions) : undefined;
  const supportsViewTransitions = !!doc && 'startViewTransition' in doc;
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (!supportsViewTransitions || prefersReducedMotion || !doc) {
    apply();
    return;
  }

  const endRadius = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );

  const transition = doc.startViewTransition(() => {
    apply();
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${originX}px ${originY}px)`,
          `circle(${endRadius}px at ${originX}px ${originY}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  }).catch(() => {});
}
