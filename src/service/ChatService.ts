import { IChat, ChatModel } from '@models/chatModal';
import { Types } from 'mongoose';

class ChatService {
  async createChat(members: Types.ObjectId[], chatName: string) {
    const isChat = await this.isChatExistByMembers(members);
    if (isChat.length < 1) {
      const newChat = new ChatModel({
        name: chatName,
        members,
      });
      const saveChat = await newChat.save();
      return saveChat;
    }
    return isChat;
  }

  async updateChat(data: any, id: Types.ObjectId): Promise<IChat | null> {
    const updatedChat = await ChatModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return updatedChat;
  }

  async isChatExistByMembers(
    members: Types.ObjectId[],
    chatId = null,
  ): Promise<IChat[]> {
    const isChat = await ChatModel.find({
      members: {
        $all: members,
      },
    });
    return isChat;
  }
}

export default ChatService;
