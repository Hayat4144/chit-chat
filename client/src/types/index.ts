export interface chatuser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  profileShortcutName?: string;
}

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  GIF = 'gif',
  VIDEO = 'video',
}

interface IPayload {
  type: MessageType;
  content: string;
  url?: {
    path: string;
    publicId: string;
    preview?: string;
  };
}

export interface Message {
  _id: string;
  payload: IPayload;
  sender: string;
  createdAt: Date;
  updatedAt: Date;
  chat: string;
  receiver?: string;
}

export interface IChat {
  _id: string;
  name: string;
  isGroupchat: boolean;
  members: chatuser[];
  createdAt: Date;
  updatedAt: Date;
  admin?: string;
  groupShortcut?: string;
  lastMessage?: Message | undefined;
}
