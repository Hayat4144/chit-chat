import AddMemebersToGroupChat from '@controller/chat/Addmembers';
import CreategroupChat from '@controller/chat/CreategroupChat';
import LastMessage from '@controller/chat/LastMessage';
import Message from '@controller/chat/Message';
import ReadMessage from '@controller/chat/ReadMessage';
import RemoveMemebersToGroupChat from '@controller/chat/Removemebers';
import UpdateGroupName from '@controller/chat/UpdateGroupName';
import Chats from '@controller/chat/chats';
import authMiddleware from '@middlewares/authMiddleware';
import express from 'express';
const chatRoutes = express.Router();

chatRoutes.post('/api/v1/chat/create/message', authMiddleware, Message);
chatRoutes.post('/api/v1/create/group/chat',authMiddleware,CreategroupChat)
chatRoutes.get('/api/v1/chats/',authMiddleware,Chats)
chatRoutes.post('/api/v1/chat/update/name',authMiddleware,UpdateGroupName)
chatRoutes.post('/api/v1/chat/add/memebers',authMiddleware,AddMemebersToGroupChat)
chatRoutes.post('/api/v1/chat/remove/memebers',authMiddleware,RemoveMemebersToGroupChat)
chatRoutes.get('/api/v1/chat/lastmessage/:receiverId',authMiddleware,LastMessage)
chatRoutes.get('/api/v1/chat/read/messages/:receiverId',authMiddleware,ReadMessage);

export default chatRoutes;
