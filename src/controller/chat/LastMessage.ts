import { httpStatusCode } from '@customtype/index';
import { ChatModel } from '@models/chatModal';
import { UserService } from '@service/userService';
import { CustomError } from '@utils/CustomError';
import asyncHandler from '@utils/asyncHandler';
import { NextFunction, Request, Response } from 'express';

const LastMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const userService = new UserService();
    const isUserExist = await userService.findUserById(receiverId);
    if (!isUserExist) return next(new CustomError('User does not exist', 400));
    const lastMessage = await ChatModel.find({
      members: {
        $all: [receiverId, req.user_id],
      },
    })
      .populate('lastMessage')
      .select('-createdAt -updatedAt ');
    res.status(httpStatusCode.OK).json({ data: lastMessage });
  },
);

export default LastMessage;
