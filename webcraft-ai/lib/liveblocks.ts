import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!
})

type Storage = {
  components: any[]
  colorPalette: string
}

export const {
  RoomProvider,
  useStorage,
  useMutation,
  useOthers,
  useMyPresence
} = createRoomContext<{}, Storage>(client)
