import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import GroupChatService from '@service/GroupChatService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

const CreategroupChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const chatService = new ChatService();
    const groupChatService = new GroupChatService();
    let { name, members } = req.body;
    if (members.includes(req.user_id)) {
      return next(
        new CustomError('Members should not contain group creator.', 400),
      );
    }
    const unique_members = [...new Set([...members, req.user_id])];
    if (unique_members.length > 20) {
      return next(new CustomError("Memebers can't be more than 20.", 400));
    }
    const isGroupchat = await groupChatService.isGroupChatExist(members, name);
    if (isGroupchat.length > 0)
      return next(new CustomError(`${name} group chat already exist.`, 400));
    const createGroupChat = await chatService.createChat(
      unique_members,
      name,
      true,
      new mongoose.Types.ObjectId(req.user_id),
    );
    if (Array.isArray(createGroupChat)) {
      return res.status(httpStatusCode.OK).json({
        data: `${createGroupChat[0].name} group has been created successfully.`,
      });
    }
    return res.status(httpStatusCode.OK).json({
      data: `${createGroupChat.name} group has been created successfully.`,
    });
  },
);

export default CreategroupChat;
