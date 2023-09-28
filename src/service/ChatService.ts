import { IChat, ChatModel } from '@models/chatModal';
import { Types } from 'mongoose';

class ChatService {
  async createChatorGetChat(
    members: Types.ObjectId[],
    chatName: string,
    isGroupChat = false,
    admin?: Types.ObjectId,
  ) {
    let isChat: IChat[];
    if (isGroupChat) {
      isChat = await this.isChatExistByMembers(members, true);
    } else {
      isChat = await this.isChatExistByMembers(members);
    }
    if (isChat.length < 1) {
      const newChat = new ChatModel({
        name: chatName,
        members,
        isGroupchat: isGroupChat,
        admin,
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
    isGroupChat?: boolean,
  ): Promise<IChat[]> {
    if (isGroupChat) {
      const groupChat = await ChatModel.find({
        members: {
          $all: members,
        },
        isGroupchat: true,
      });
      return groupChat;
    }
    const isChat = await ChatModel.find({
      members: {
        $all: members,
      },
    });
    return isChat;
  }
  async getMembers(chatId: string, isGroupchat = false) {
    const memebers = await ChatModel.find({
      _id: chatId,
      isGroupchat,
    }).select('members');
    return memebers;
  }

  async userChats(userId: Types.ObjectId) {
    const chats = await ChatModel.find({
      members: {
        $in: [userId],
      },
    })
      .populate({ path: 'lastMessage', select: '-sender -receiver -chat' })
      .populate({ path: 'members', select: 'firstName lastName email' })
      .select('-createdAt -updatedAt')
      .sort({ updatedAt: -1 });
    return chats;
  }

  async isChatExist(chatId: Types.ObjectId) {
    const isChat = await ChatModel.findById(chatId).populate(
      'members',
      '-password',
    );
    return isChat;
  }
}

export default ChatService;
