import { httpStatusCode } from '@customtype/index';
import { UserService } from '@service/userService';
import asyncHandler from '@utils/asyncHandler';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const SearchUser = asyncHandler(async (req: Request, res: Response) => {
  const { searchString } = req.query;
  if (!searchString || typeof searchString !== 'string')
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .json({ error: 'SearchString is required.' });
  const userService = new UserService();
  const userId = new mongoose.Types.ObjectId(req.user_id);
  const user = await userService.searchUser(searchString as string, userId);
  return res.status(httpStatusCode.OK).json({ data: user });
});

export default SearchUser;
