import { Types } from 'mongoose';
import ChatService from './ChatService';
import { MessageModel, IMessage } from '@models/MessageModal';
import { Request } from 'express';
import { emitSocketEvent } from 'Sockets';
import { ChatEvent } from '@customtype/index';
import { IChat } from '@models/chatModal';

class MessageService {
  private chat: ChatService;

  constructor() {
    this.chat = new ChatService();
  }
  async PrivateMessage(
    members: Types.ObjectId[],
    data: any,
    isGroupchat: boolean | undefined,
    req: Request,
  ): Promise<IMessage> {
    const Chats = await this.chat.createChatorGetChat(
      members,
      'one-to-one',
      isGroupchat,
    );
    let messageData;
    if (Array.isArray(Chats)) {
      messageData = {
        ...data,
        chat: Chats[0].id,
      };
    } else {
      messageData = {
        ...data,
        chat: Chats.id,
      };
    }
    const saveMessage = await this.createMessage(messageData);
    const updatelastMessage = await this.chat.updateChat(
      { lastMessage: saveMessage.id },
      saveMessage.chat,
    );
    const sendSocketMessage = (room: string) => {
      emitSocketEvent(req, room, ChatEvent.MESSAGESEND, saveMessage);
    };
    if (Array.isArray(Chats)) {
      const receiverId = this.privateRoom(Chats[0], req.user_id);
      sendSocketMessage(receiverId);
    } else {
      const receiverId = this.privateRoom(Chats, req.user_id);
      sendSocketMessage(receiverId);
    }
    return saveMessage;
  }

  async GroupMessage(chatId: Types.ObjectId, data: any, req: Request) {
    let messageData = {
      ...data,
      chat: chatId,
    };
    const saveMessage = await this.createMessage(messageData);
    const updatelastMessage = await this.chat.updateChat(
      { lastMessage: saveMessage.id },
      saveMessage.chat,
    );
    const sendSocketMessage = (room: string) => {
      emitSocketEvent(req, room, ChatEvent.MESSAGESEND, saveMessage);
    };
    sendSocketMessage(chatId.toString());
    return saveMessage;
  }

  private privateRoom(chat: IChat, senderId: string) {
    return chat.members
      .find((memberId) => memberId.toString() !== senderId)
      ?.toString() as string;
  }

  async createMessage(data: any): Promise<IMessage> {
    const message = new MessageModel({ ...data });
    const saveMessage = await message.save();
    return saveMessage;
  }

  async fetchMessageByChatId(id: Types.ObjectId) {
    const messages = await MessageModel.find({ chat: id });
    return messages;
  }
}

export default MessageService;
