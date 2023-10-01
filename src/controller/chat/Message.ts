import { httpStatusCode } from '@customtype/index';
import MessageService from '@service/MessageService';
import { UserService } from '@service/userService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';

const Message = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId, payload, isGroupchat } = req.body;
    const userSerice = new UserService();
    const messageService = new MessageService();
    const isUser = await userSerice.findUserById(receiverId);
    if (!isUser) return next(new CustomError('User does not exist', 400));
    const data = {
      payload,
      sender: req.user_id,
      receiver: receiverId,
    };
    const createnewMessage = await messageService.Newmessage(
      [receiverId, req.user_id],
      data,
      isGroupchat,
      req,
    );
    return res.status(httpStatusCode.OK).json({ data: createnewMessage });
  },
);

export default Message;
