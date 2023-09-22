import { Response, Request, NextFunction } from 'express';
import { httpStatusCode } from '@customtype/index';
import bcrypt from 'bcrypt';
import { getAccessToken } from '@utils/jwt';
import { payload } from '@customtype/index';
import asyncHandler from '@utils/asyncHandler';
import { IsUserExist } from '@service/userService';

const Signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const IsUser = await IsUserExist(email);
    if (!IsUser) {
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: `${email} does not exist.` });
    }
    if (IsUser.provider !== 'credential') {
      return res.status(400).json({ error: 'Invalid credentails' });
    }
    const isValidPassword = await bcrypt.compare(
      password as string,
      IsUser.password as string,
    );
    if (!isValidPassword)
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ error: 'Invalid credentials' });
    const payload: payload = {
      id: IsUser.id,
      name: `${IsUser.firstName} ${IsUser.lastName}`,
      email: IsUser.email,
    };
    const AccessToken = await getAccessToken(payload);
    return res
      .status(httpStatusCode.OK)
      .json({ data: 'you are signin successfully.', token: AccessToken });
  },
);

export default Signin;
