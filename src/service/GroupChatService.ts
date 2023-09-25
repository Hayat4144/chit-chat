import { Types } from 'mongoose';
import ChatService from './ChatService';
import { ChatModel } from '@models/chatModal';

class GroupChatService extends ChatService {
  async isGroupChatExist(memebers: Types.ObjectId[], name: string) {
    const isGroupChat = await ChatModel.find({
      members: {
        $all: memebers,
      },
      name,
      isGroupchat: true,
    });
    return isGroupChat;
  }

  async isGroupChatUser(members: Types.ObjectId[], chatid: string) {
    const isUsers = await ChatModel.find({
      _id: chatid,
      members: {
        $in: members,
      },
      isGroupchat: true,
    });
    return isUsers;
  }

  async addMembers(newMemebers: Types.ObjectId[], chatId: string) {
    const addNewMembers = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: {
          members: newMemebers,
        },
      },
      { new: true },
    );
    return addNewMembers;
  }

  async removeMembers(memebers: Types.ObjectId[], chatId: string) {
    const removeMembers = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          members: { $in: memebers },
        },
      },
      { new: true },
    );
    return removeMembers;
  }
}

export default GroupChatService;
