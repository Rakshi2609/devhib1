import mongoose, { Schema, Document, models } from 'mongoose'

export interface INotification extends Document {
  toUsername: string
  fromUsername: string
  roomId: string
  link: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    toUsername: { type: String, required: true, lowercase: true, trim: true },
    fromUsername: { type: String, required: true, lowercase: true, trim: true },
    roomId: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification = models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
