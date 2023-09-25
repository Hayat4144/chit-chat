import asyncHandler from '@utils/asyncHandler';
import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import { CustomError } from '@utils/CustomError';
import { NextFunction, Request, Response } from 'express';

const UpdateGroupName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, chatId } = req.body;
    const chatService = new ChatService();
    const isGroupChat = await chatService.isChatExist(chatId);

    if (!isGroupChat || !isGroupChat.isGroupchat)
      return next(new CustomError('Group chat does not exist', 400));

    if (isGroupChat?.admin?.toString() !== req.user_id)
      return next(
        new CustomError('You are not admin. Only admin can add members.', 400),
      );

    const updateChatName = await chatService.updateChat({ name }, chatId);
    return res.status(httpStatusCode.OK).json({ data: updateChatName });
  },
);

export default UpdateGroupName;