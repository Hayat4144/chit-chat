import AddMemebersToGroupChat from '@controller/chat/Addmembers';
import CreateGroupMessage from '@controller/chat/CreateGroupMessage';
import CreategroupChat from '@controller/chat/CreategroupChat';
import LastMessage from '@controller/chat/LastMessage';
import Message from '@controller/chat/Message';
import PrivateChat from '@controller/chat/PrivateChat';
import ReadMessage from '@controller/chat/ReadMessage';
import RecentChatuser from '@controller/chat/RecentChatuser';
import RemoveMemebersToGroupChat from '@controller/chat/Removemebers';
import SearchUser from '@controller/chat/SearchUser';
import UpdateGroupName from '@controller/chat/UpdateGroupName';
import Chats from '@controller/chat/chats';
import authMiddleware from '@middlewares/authMiddleware';
import express from 'express';
const chatRoutes = express.Router();

chatRoutes.post('/api/v1/chat/create/message', authMiddleware, Message);
chatRoutes.post('/api/v1/create/group/chat', authMiddleware, CreategroupChat);
chatRoutes.get('/api/v1/recent/chat/members', authMiddleware, RecentChatuser);

chatRoutes.get('/api/v1/chats/', authMiddleware, Chats);
chatRoutes.post('/api/v1/chat/update/name', authMiddleware, UpdateGroupName);
chatRoutes.post(
  '/api/v1/chat/add/memebers',
  authMiddleware,
  AddMemebersToGroupChat,
);
chatRoutes.post(
  '/api/v1/chat/remove/memebers',
  authMiddleware,
  RemoveMemebersToGroupChat,
);
chatRoutes.get(
  '/api/v1/chat/lastmessage/:receiverId',
  authMiddleware,
  LastMessage,
);
chatRoutes.get(
  '/api/v1/chat/read/messages/:ChatId',
  authMiddleware,
  ReadMessage,
);
chatRoutes.get('/api/v1/chat/:ChatId', authMiddleware, PrivateChat);
chatRoutes.get('/api/v1/chat/search/user', authMiddleware, SearchUser);
chatRoutes.post('/api/v1/chat/create/group/message',authMiddleware,CreateGroupMessage)

export default chatRoutes;
