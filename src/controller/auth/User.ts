import { Response, Request, NextFunction } from 'express';
import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asyncHandler';
import { IsUserExist } from '@service/userService';

const User = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const IsUser = await IsUserExist(email);
    if (!IsUser) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: 'User does not exist.' });
    }
    return res.status(httpStatusCode.OK).json({ user: IsUser });
  },
);

export default User;
