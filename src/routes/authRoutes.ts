import Signin from '@controller/auth/signin';
import Signup from '@controller/auth/signup';
import express from 'express';
const authRouter = express.Router();

authRouter.post('/api/v1/auth/signup', Signup);
authRouter.post('/api/v1/auth/signin', Signin);

export default authRouter;
