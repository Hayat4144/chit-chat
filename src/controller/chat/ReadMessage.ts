import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import MessageService from '@service/MessageService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const ReadMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ChatId } = req.params;
    const chatService = new ChatService();
    const isChatExist = await chatService.isChatExist(
      new mongoose.Types.ObjectId(ChatId),
    );
    if (!isChatExist)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: 'Chat does not exist.' });
    let isUserAuthorized = false;
    for (const member of isChatExist.members) {
      if (member._id.toString() === req.user_id) {
        isUserAuthorized = true;
        break;
      }
    }
    if (!isUserAuthorized) {
      return next(
        new CustomError('You are unauthorized', httpStatusCode.FORBIDDEN),
      );
    }
    const messageService = new MessageService();
    const messages = await messageService.fetchMessageByChatId(isChatExist.id);
    return res.status(200).json({ data: messages });
  },
);

export default ReadMessage;
