import { httpStatusCode } from '@customtype/index';
import ChatService from '@service/ChatService';
import MessageService from '@service/MessageService';
import asyncHandler from '@utils/asyncHandler';
import { Request, Response } from 'express';

const CreateGroupMessage = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, payload } = req.body;
  const chatService = new ChatService();
  const isChatExist = await chatService.isChatExist(chatId);
  if (!isChatExist)
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .json({ error: 'Chat does not exist' });
  if (!isChatExist.isGroupchat)
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .json({ error: 'It is not a group chat.' });
  const messageService = new MessageService();
  const data = {
    payload,
    sender: req.user_id,
  };
  const createnewMessage = await messageService.GroupMessage(chatId,data,req)
  return res.status(httpStatusCode.OK).json({data:createnewMessage})
});


export default CreateGroupMessage;