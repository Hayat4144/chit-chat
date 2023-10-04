import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import asyncHandler from '@utils/asyncHandler';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

const RecentChatuser = asyncHandler(async (req: Request, res: Response) => {
  const userObjectID = new mongoose.Types.ObjectId(req.user_id);
  const chatService = new ChatService();
  const recentChatUser = await chatService.recentChatUser(userObjectID);
  const allUsers = recentChatUser.map((item) =>
    item.members.find((member) => member._id.toString() !== req.user_id),
  );
  res.status(httpStatusCode.OK).json({data:allUsers})
});

export default RecentChatuser;
