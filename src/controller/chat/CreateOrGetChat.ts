import { httpStatusCode } from '@customtype/index';
import { ChatModel } from '@models/chatModal';
import ChatService from '@service/ChatService';
import { UserService } from '@service/userService';
import asyncHandler from '@utils/asyncHandler';
import { defaultMaxListeners } from 'events';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const CreateorGetChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userService = new UserService();
  const isUserExist = await userService.findUserById(userId);
  if (!isUserExist)
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .json({ erro: 'User does not exist.' });
  const members = [isUserExist._id, new mongoose.Types.ObjectId(req.user_id)];
  const isChatExist = await ChatModel.find({
    members,
  }).populate({ path: 'members', select: 'firstName lastName' });
  if (isChatExist.length > 0) {
    return res.status(httpStatusCode.OK).json({ data: isChatExist[0] });
  }
  const newChat = new ChatModel({
    name: 'one-to-one',
    members,
  });
  const saveChat = await newChat.save();
  const document = await saveChat.populate({
    path: 'members',
    select: 'firstName lastName',
  });
  return res.status(httpStatusCode.OK).json({ data: document });
});

export default CreateorGetChat;
