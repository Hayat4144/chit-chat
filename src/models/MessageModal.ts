import mongoose, { Document, Schema, Model, Types } from 'mongoose';

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  GIF = 'gif',
  VIDEO = 'video',
}

interface IPayload extends Document {
  type: MessageType;
  content: string;
  url?: {
    path: string;
    publicId: string;
    preview?: string;
  };
}
const PayloadSchema = new Schema<IPayload>({
  type: {
    type: String,
    enum: Object.values(MessageType),
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    path: String,
    publicId: String,
    preview: String,
  },
});

interface IMessage extends Document {
  payload: IPayload;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  chat: Types.ObjectId;
}

const MessageSchema = new Schema<IMessage>(
  {
    payload: PayloadSchema,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
  },
  { timestamps: true },
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  'Message',
  MessageSchema,
);

export { IMessage, MessageModel };
