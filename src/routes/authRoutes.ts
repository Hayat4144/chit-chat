import Signin from '@controller/auth/signin';
import Signup from '@controller/auth/signup';
import verifySocailToken from '@controller/auth/verifysocialtoken';
import express from 'express';
const authRouter = express.Router();

authRouter.post('/api/v1/auth/signup', Signup);
authRouter.post('/api/v1/auth/signin', Signin);
authRouter.post('/api/v1/auth/verify/social/token', verifySocailToken);

export default authRouter;
