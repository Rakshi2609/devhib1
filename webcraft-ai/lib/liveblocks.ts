import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!
})

export type Page = {
  id: string
  name: string
  slug: string        // e.g. 'home', 'about', 'pricing' — used as anchor #slug
  components: any[]
}

type Storage = {
  pages: Page[]
  activePage: string  // id of the currently active page in the editor
  colorPalette: string
  // Legacy field kept for backward-compat; new projects use pages[]
  components: any[]
}

export const {
  RoomProvider,
  useStorage,
  useMutation,
  useOthers,
  useMyPresence
} = createRoomContext<{}, Storage>(client)
