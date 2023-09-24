import ChatService from '@service/ChatService';
import MessageService from '@service/MessageService';
import { UserService } from '@service/userService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const ReadMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const userService = new UserService();
    const isUserExist = await userService.findUserById(receiverId);
    if (!isUserExist) return next(new CustomError('User does not exist', 400));
    const chatService = new ChatService();
    const messageService = new MessageService();

    // Convert receiverId and req.user_id to Types.ObjectId
    const receiverIdObject = new mongoose.Types.ObjectId(receiverId);
    const senderIdObject = new mongoose.Types.ObjectId(req.user_id);
    const chat = await chatService.isChatExistByMembers([
      receiverIdObject,
      senderIdObject,
    ]);

    const messages = await messageService.fetchMessageByChatId(chat[0].id);
    return res.status(200).json({ data: messages });
  },
);

export default ReadMessage;
