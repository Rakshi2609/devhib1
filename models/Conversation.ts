import mongoose, { Schema, Document } from 'mongoose'

export interface IConversation extends Document {
  userId: string
  prompt: string
  response: any // The JSON components generated
  thoughts: {
    agent: string
    content: string
    timestamp: Date
  }[]
  createdAt: Date
}

const ConversationSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  response: { type: Schema.Types.Mixed },
  thoughts: [{
    agent: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)
