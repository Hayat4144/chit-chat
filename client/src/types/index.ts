export interface chatuser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  profileShortcutName?: string;
}

export enum ChatEnum {
  RECEIVEDMESSAGE = 'receive_message',
  TYPING = 'typing',
  USERTYPING = 'userTyping',
  JOINCHAT = 'joinChat',
  USERSTOPTYPING = 'userStopTyping',
  STOPTYPING = 'stopTyping',
  LEAVECHAT = 'leavechat',
  USERUPDATESTATUS = 'userStatusUpdate',
}

enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  GIF = 'gif',
  VIDEO = 'video',
  APPLICATION = 'application',
  PDF = 'pdf',
}
interface IPayload {
  type: MessageType;
  content: string;
  url?: {
    file_url: string;
    content: string;
    public_id: string;
    preview?: {
      url: string;
      public_id: string;
    };
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

export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  profileShortcutName?: string;
}
