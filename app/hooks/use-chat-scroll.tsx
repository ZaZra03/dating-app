/**
 * Custom hook for managing chat message container scrolling.
 * Provides automatic scrolling to the bottom when new messages arrive.
 */

import { useCallback, useRef } from 'react'

/**
 * Hook for managing chat container scroll position.
 * 
 * @returns Object containing containerRef and scrollToBottom function
 * 
 * @returns { containerRef: RefObject<HTMLDivElement> } - Ref to attach to the scrollable container
 * @returns { scrollToBottom: () => void } - Function to scroll the container to the bottom smoothly
 */
export function useChatScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  return { containerRef, scrollToBottom }
}
