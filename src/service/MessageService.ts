import { Types } from 'mongoose';
import ChatService from './ChatService';
import { MessageModel, IMessage } from '@models/MessageModal';

class MessageService {
  private chat: ChatService;

  constructor() {
    this.chat = new ChatService();
  }
  async Newmessage(members: Types.ObjectId[], data: any,isGroupchat:boolean | undefined): Promise<IMessage> {
    const Chats = await this.chat.createChatorGetChat(members, 'one-to-one',isGroupchat);
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
    return saveMessage;
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
