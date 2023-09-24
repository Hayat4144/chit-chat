import Message from '@controller/chat/Message';
import ReadMessage from '@controller/chat/ReadMessage';
import authMiddleware from '@middlewares/authMiddleware';
import express from 'express';
const chatRoutes = express.Router();

chatRoutes.post('/api/v1/chat/create/message', authMiddleware, Message);
chatRoutes.get(
  '/api/v1/chat/read/messages/:receiverId',
  authMiddleware,
  ReadMessage,
);

export default chatRoutes;
