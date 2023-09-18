import { NextFunction, Request, Response } from 'express';
import asyncHandler from '@utils/asyncHandler';
import { httpStatusCode } from '@customtype/index';
import { IsUserExist } from '@service/userService';
import UserModel from '@models/userModal';

const Signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, provider } = await req.body;
    const IsUser = await IsUserExist(email);
    if (IsUser) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: 'User already exist.' });
    }
    const user = new UserModel({
      lastName,
      firstName,
      email,
      password,
      provider,
    });
    const saveUser = await user.save();
    return res.status(httpStatusCode.OK).json({
      data: `${saveUser.email} has been created successfully.`,
    });
  },
);

export default Signup;
