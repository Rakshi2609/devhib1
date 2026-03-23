import mongoose, { Schema, Document, models } from 'mongoose'

export type RoomRole = 'view' | 'edit'

interface Collaborator {
  username: string
  role: RoomRole
}

export interface IEditorRoom extends Document {
  roomId: string
  ownerUsername: string
  collaborators: Collaborator[]
  shareTokens: {
    view: string
    edit: string
  }
  createdAt: Date
  updatedAt: Date
}

const CollaboratorSchema = new Schema<Collaborator>(
  {
    username: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['view', 'edit'], required: true },
  },
  { _id: false }
)

const EditorRoomSchema = new Schema<IEditorRoom>(
  {
    roomId: { type: String, required: true, unique: true, trim: true },
    ownerUsername: { type: String, required: true, lowercase: true, trim: true },
    collaborators: { type: [CollaboratorSchema], default: [] },
    shareTokens: {
      view: { type: String, required: true },
      edit: { type: String, required: true },
    },
  },
  { timestamps: true }
)

const EditorRoom = models.EditorRoom || mongoose.model<IEditorRoom>('EditorRoom', EditorRoomSchema)

export default EditorRoom
