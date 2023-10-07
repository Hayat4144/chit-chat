import { ChatEvent } from '@customtype/index';
import logger from '@utils/logger';
import { Server } from 'socket.io';
import { Request } from 'express';
import { UserService } from '@service/userService';
import ChatService from '@service/ChatService';
import { promises } from 'dns';
const userService = new UserService();
const chatService = new ChatService();

const initilizeSocketIo = (io: Server) => {
  return io.on(ChatEvent.CONNECTION, async (socket) => {
    logger.info(`connected to socket,${socket.id}`);
    socket.join(socket.user.id);

    // update the user status
    const updateStatus = await userService.createOrupdateUserStatus(
      socket.user.id,
      true,
    );

    socket.broadcast.emit(ChatEvent.USERUPDATESTATUS, updateStatus);

    socket.on(ChatEvent.JOINCHAT, async (chatId) => {
      socket.join(chatId);
      const isChatExist = await chatService.isChatExist(chatId);
      if (isChatExist && !isChatExist.isGroupchat) {
        const userStatus = await userService.getUserstatus(socket.user.id);
        socket.broadcast
          .to(chatId)
          .emit(ChatEvent.USERUPDATESTATUS, userStatus);
        const otherUser = isChatExist.members.find(
          (member) => member._id.toString() !== socket.user.id,
        );
        if (otherUser) {
          const status = await userService.getUserstatus(otherUser._id);
          io.to(socket.user.id).emit(ChatEvent.USERUPDATESTATUS, status);
        }
      }
    });

    // send the acknowledgment to the user he is connected now
    socket.emit(ChatEvent.CONNECTED, { message: 'success' });

    // listening for the typing event
    socket.on(ChatEvent.TYPING, (data) => {
      socket.broadcast
        .to(data.chatId)
        .emit(ChatEvent.USERTYPING, { user: data.userId });
    });

    // listening for the stop typing event
    socket.on(ChatEvent.STOPTYPING, (data) => {
      socket.broadcast
        .to(data.chatId)
        .emit(ChatEvent.USERSTOPTYPING, { user: data.userId });
    });

    socket.on(ChatEvent.LEAVECHAT, (chatid) => {
      socket.leave(chatid);
      logger.info(`user leave the chat ${chatid}.`);
    });

    socket.on(ChatEvent.DISCONNECTED, async () => {
      logger.info(`user ${socket.user.id} is now disconnected.`);
      const updateStatus = await userService.createOrupdateUserStatus(
        socket.user.id,
        false,
      );
      socket.broadcast.emit(ChatEvent.USERUPDATESTATUS, updateStatus);
      socket.leave(socket.user.id);
    });
  });
};

const emitSocketEvent = (
  req: Request,
  room: string,
  event: string,
  payload?: any,
) => {
  req.app.get('io').in(room).emit(event, payload);
};

export { initilizeSocketIo, emitSocketEvent };
