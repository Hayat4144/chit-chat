import ConnectDatabase from '@config/DatabaseConfig';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import logger from '@utils/logger';
import CloudinaryConfiguration from '@config/CloudinaryConfig';
import authRouter from 'routes/authRoutes';
import ErrorMiddleware from '@middlewares/ErrorMiddleware';
import userRouter from 'routes/userRoutes';
import chatRoutes from 'routes/chatRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initilizeSocketIo } from 'Sockets';
import { verifyToken } from '@utils/jwt';
import { httpStatusCode } from './types';
import path from 'path';
import { createReadStream, read } from 'fs';

dotenv.config();
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
app.set('io', io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    if (!token) {
      const err = new Error('You are unauothorized.');
      (err as any).data = {
        code: httpStatusCode.FORBIDDEN,
        reason: 'Invalid token',
      };
      next(err);
    }
    const isValidtoken = await verifyToken(token as string, 30);
    socket.user = isValidtoken;
    next();
  } catch (error: any) {
    const err = new Error(error.message);
    (err as any).data = {
      code: httpStatusCode.BAD_REQUEST,
    };
    next(err);
    logger.error(error);
  }
});
initilizeSocketIo(io);

CloudinaryConfiguration();

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
const dir = path.join(process.cwd(), 'uploads');

app.get('/images/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(dir, 'images', filename);
  const readStream = createReadStream(filePath);
  readStream.on('error', (error) => {
    if ((error as any).code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
  res.setHeader('Content-Disposition', `inline; filename=${filename}`);
  readStream.on('data', (chunk) => res.write(chunk));
  readStream.on('end', () => res.send());
});

app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(chatRoutes);
app.use(ErrorMiddleware);

ConnectDatabase().then(() => {
  http.listen(port, () => {
    logger.info(`Server is running http://localhost:${port}`);
  });
});
