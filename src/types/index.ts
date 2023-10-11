import { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
// Define custom properties for Request object
declare global {
  namespace Express {
    interface Request {
      user_id: string;
      email: string;
      name: string;
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    user: JwtPayload;
  }
}

export enum ChatEvent {
  CONNECTION = 'connection',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnect',
  MESSAGESEND = 'receive_message',
  TYPING = 'typing',
  JOINCHAT = 'joinChat',
  USERTYPING = 'userTyping',
  USERSTOPTYPING = 'userStopTyping',
  STOPTYPING = 'stopTyping',
  ONLINE = 'online',
  USERONLINE = 'user_online',
  LEAVECHAT = 'leavechat',
  USERUPDATESTATUS = 'userStatusUpdate',
}

export interface payload extends JwtPayload {
  email: string;
  name: string;
  id: string;
  created_at?: Date;
}

export enum httpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export interface Resolveresponse {
  url: string;
  public_id: string;
}
