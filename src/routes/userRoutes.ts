import User from '@controller/auth/User';
import express from 'express';
const userRouter = express.Router();

userRouter.post('/api/v1/isUser', User);

export default userRouter;