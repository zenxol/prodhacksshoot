'use client';

import { useLayoutEffect } from 'react';

/**
 * Sets --vvh (visual viewport height) on document so layout can fit the visible
 * area on iOS Safari (address bar visible). Prevents scroll when browser UI is shown.
 */
function setVvh() {
  const h =
    typeof window !== 'undefined'
      ? (window.visualViewport?.height ?? window.innerHeight)
      : 0;
  document.documentElement.style.setProperty('--vvh', `${h}px`);
}

export function ViewportHeight() {
  useLayoutEffect(() => {
    setVvh();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', setVvh);
    vv?.addEventListener('scroll', setVvh);
    window.addEventListener('resize', setVvh);
    window.addEventListener('orientationchange', () => setTimeout(setVvh, 100));
    return () => {
      vv?.removeEventListener('resize', setVvh);
      vv?.removeEventListener('scroll', setVvh);
      window.removeEventListener('resize', setVvh);
    };
  }, []);
  return null;
}
