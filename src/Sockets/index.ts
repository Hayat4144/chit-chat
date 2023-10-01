import { ChatEvent } from '@customtype/index';
import logger from '@utils/logger';
import { Server } from 'socket.io';
import { Request } from 'express';

const initilizeSocketIo = (io: Server) => {
  return io.on(ChatEvent.CONNECTION, (socket) => {
    logger.info(`connected to socket,${socket.id}`);
    socket.join(socket.user.id);

    socket.on(ChatEvent.JOINCHAT, (chatId) => {
      socket.join(chatId);
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
