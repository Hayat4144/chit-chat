import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const Chats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatService = new ChatService();
    const userChats = await chatService.userChats(new mongoose.Types.ObjectId(req.user_id));
    return res.status(httpStatusCode.OK).json({data:userChats})
  },
);

export default Chats;