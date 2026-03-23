import mongoose, { Schema, Document, models } from 'mongoose'

export interface ISite extends Document {
  subdomain: string
  title: string
  description: string
  ownerUsername: string
  content: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const SiteSchema = new Schema<ISite>(
  {
    subdomain: {
      type: String,
      required: [true, 'Subdomain is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'],
    },
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String, default: '' },
    ownerUsername: { type: String, required: true, lowercase: true, trim: true },
    content: {
      type: Schema.Types.Mixed,
      default: {
        hero: {
          heading: 'Welcome to My Site',
          subheading: 'Built with WebCraft AI',
        },
      },
    },
  },
  {
    timestamps: true,
  }
)

// Prevent OverwriteModelError in dev with hot reload
const Site = models.Site || mongoose.model<ISite>('Site', SiteSchema)

export default Site
