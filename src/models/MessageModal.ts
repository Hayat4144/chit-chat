import mongoose, { Document, Schema, Model, Types } from 'mongoose';

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  GIF = 'gif',
  VIDEO = 'video',
  APPLICATION='application',
  PDF='pdf',
}

interface IPayload {
  type: MessageType;
  content: string;
  url?: {
    file_url: string;
    public_id: string;
    preview?: null | {
      url: string;
      public_id: string;
    };
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
  },
  url: {
    file_url: String,
    content: String,
    public_id: String,
    preview: {
      url: String,
      public_id: String,
    },
  },
});

interface IMessage extends Document {
  payload: IPayload;
  sender: Types.ObjectId;
  chat: Types.ObjectId;
}

const MessageSchema = new Schema<IMessage>(
  {
    payload: PayloadSchema,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
  },
  { timestamps: true },
);

const MessageModel: Model<IMessage> = mongoose.model<IMessage>(
  'Message',
  MessageSchema,
);

export { IMessage, MessageModel };
