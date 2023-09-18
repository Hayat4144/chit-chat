import ConnectDatabase from '@config/DatabaseConfig';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '@utils/logger';
import CloudinaryConfiguration from '@config/CloudinaryConfig';
import authRouter from 'routes/authRoutes';
import ErrorMiddleware from '@middlewares/ErrorMiddleware';

const app = express();
CloudinaryConfiguration();
dotenv.config();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL as string]
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(authRouter);
app.use(ErrorMiddleware);

ConnectDatabase().then(() => {
  app.listen(port, () => {
    logger.info(`Server is running http://localhost:${port}`);
  });
});
