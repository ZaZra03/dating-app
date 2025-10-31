/**
 * Custom hook for detecting mobile viewport sizes.
 * Uses media queries to determine if the current viewport is mobile-sized.
 */

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook for detecting mobile viewport.
 * 
 * @returns Boolean indicating if the viewport width is below the mobile breakpoint
 * 
 * The hook:
 * - Returns undefined initially until window is available
 * - Returns true if viewport width < 768px
 * - Returns false if viewport width >= 768px
 * - Listens to window resize events and updates accordingly
 * 
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Render mobile-specific UI
 * }
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
