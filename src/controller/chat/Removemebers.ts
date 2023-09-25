import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import GroupChatService from '@service/GroupChatService';
import { UserService } from '@service/userService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';

const RemoveMemebersToGroupChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, members } = req.body;
    const chatService = new ChatService();
    const userService = new UserService();
    const groupChatService = new GroupChatService();
    const isGroupChat = await chatService.isChatExist(chatId);
    if (!isGroupChat || !isGroupChat.isGroupchat)
      return next(new CustomError('Group chat does not exist', 400));

    if (isGroupChat?.admin?.toString() !== req.user_id)
      return next(
        new CustomError(
          'You are not admin. Only admin can remove members.',
          400,
        ),
      );
    const userPromise = await Promise.allSettled(
      members.map((value: any) => userService.findUserById(value)),
    );

    userPromise.forEach((element) => {
      if (element.status === 'fulfilled' && element.value === null)
        return next(new CustomError('User does not exist.', 400));
    });
    const removeMembers = await groupChatService.removeMembers(members, chatId);
    return res.status(httpStatusCode.OK).json({ data: removeMembers });
  },
);

export default RemoveMemebersToGroupChat;
