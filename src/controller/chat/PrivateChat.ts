import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const PrivateChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ChatId } = req.params;
    const chatService = new ChatService();
    const isChatExist = await chatService.isChatExist(
      new mongoose.Types.ObjectId(ChatId),
    );
    if (!isChatExist) return next(new CustomError('Chat does not exist', 400));
    let isUserAuthorized = false;
    for (const member of isChatExist.members) {
      if (member._id.toString() === req.user_id) {
        isUserAuthorized = true;
        break;
      }
    }
    if (!isUserAuthorized) {
      return next(new CustomError('You are unauthorized', 401));
    }
    return res.status(httpStatusCode.OK).json({ data: isChatExist });
  },
);

export default PrivateChat;
