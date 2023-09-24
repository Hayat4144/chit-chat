import mongoose, { Document, Schema, Model, Types } from 'mongoose';

interface IChat extends Document {
  name: string;
  isGroupchat: boolean;
  members: Types.ObjectId[];
  lastMessage: Types.ObjectId;
  admin?: Types.ObjectId;
}

const ChatSchema = new Schema<IChat>(
  {
    name: { type: String, required: true },
    isGroupchat: {
      type: Boolean,
      default: false,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const ChatModel: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);

export { ChatModel, IChat };
