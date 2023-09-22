import { Response, Request, NextFunction } from 'express';
import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asyncHandler';
import { OAuth2Client } from 'google-auth-library';
import { getAccessToken } from '@utils/jwt';
import { IsUserExist } from '@service/userService';
const client = new OAuth2Client();

const verifySocailToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userExist = await IsUserExist(payload?.email);
    const access_token = await getAccessToken({
      id: userExist?.id,
      name: payload?.name,
      email: userExist?.email,
    });
    return res.status(httpStatusCode.OK).json({ access_token });
  },
);

export default verifySocailToken;
