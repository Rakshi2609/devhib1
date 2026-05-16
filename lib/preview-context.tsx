'use client'
import { createContext, useContext } from 'react'

/**
 * Shared context for preview mode.
 * Lets nested components (e.g. page-button) trigger page navigation
 * without prop-drilling through the Component tree.
 */
export interface PreviewContextValue {
  /** All pages available in the preview */
  pages: { id: string; name: string; slug: string }[]
  /** Switch to a page by its id */
  setActivePageId: (id: string) => void
}

export const PreviewContext = createContext<PreviewContextValue>({
  pages: [],
  setActivePageId: () => {},
})

export function usePreviewContext() {
  return useContext(PreviewContext)
}
