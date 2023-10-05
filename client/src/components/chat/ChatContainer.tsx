'use client';
import React, { Fragment, useEffect, useState } from 'react';
import Chatheader from './Chatheader';
import Chatbody from './Chatbody';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '../Icons';
import { ChatEnum, IChat, Message } from '@/types';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import fetchMesages from '@/service/fetchMessage';
import { toast } from '../ui/use-toast';
import sendMessage from '@/service/sendMessage';
import { useSocket } from '@/context/SocketProvider';
import CreateGroupMessage from '@/service/CreateGroupMessage';
import EmojiPicker from './EmojiPicker';

interface ChatContainerProps {
  chat: IChat[];
}

export default function ChatContainer({ chat }: ChatContainerProps) {
  const { id } = useParams();
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const session = useSession();
  const [messages, setmessages] = useState<Message[]>([]);
  const [inputValue, setinputValue] = useState<string>('');
  const [isTyping, setisTyping] = useState<boolean>(false);

  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const refetchQuery = () => {
    queryClient.invalidateQueries(['chats']);
    queryClient.refetchQueries(['chats']);
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit(ChatEnum.JOINCHAT, id);

    socket.on(ChatEnum.RECEIVEDMESSAGE, (message) => {
      setmessages((prevState) => [...prevState, message]);
    });

    socket.on(ChatEnum.USERTYPING, ({ user }) => {
      if (user !== session.data.user.id) {
        setisTyping(true);
        console.log(`user is typing ${user}`);
      }
    });

    socket.on(ChatEnum.USERSTOPTYPING, ({ user }) => {
      if (user !== session.data.user.id) {
        setisTyping(false);
        console.log(`user is stop typing ${user}`);
      }
    });

    return () => {
      socket.off(ChatEnum.RECEIVEDMESSAGE);
      socket.off(ChatEnum.USERTYPING);
      socket.off(ChatEnum.JOINCHAT);
    };
  }, [socket]);

  const result = useQuery(
    ['message'],
    () => {
      return fetchMesages(session.data.user.token, id);
    },
    { enabled: isFetched },
  );

  useEffect(() => {
    if (session.data?.user.token) {
      toggleFetch(true);
      return;
    }
  }, [session]);

  useEffect(() => {
    if (result.data) {
      const { data, error } = result.data as { data: Message[]; error: any };
      if (error) {
        toast({ title: error, variant: 'destructive' });
        return;
      }
      setmessages(data);
    }
  }, [result.data, result.isLoading]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinputValue(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit(ChatEnum.STOPTYPING, {
      chatId: id as string,
      userId: session.data.user.id,
    });
    if (chat[0].isGroupchat) {
      const { error } = await CreateGroupMessage(
        session.data.user.token,
        id as string,
        inputValue,
      );
      if (error) {
        return toast({ variant: 'destructive', title: error });
      }
      setinputValue('');
      refetchQuery();
      return;
    }
    const { data, error } = await sendMessage(
      session.data.user.token,
      chat[0].members[0]._id,
      inputValue,
    );
    if (error) {
      return toast({ variant: 'destructive', title: error });
    }
    setmessages((prevState) => [...prevState, data]);
    setinputValue('');
    refetchQuery();
  };

  const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    socket.emit(ChatEnum.TYPING, {
      chatId: id as string,
      userId: session.data.user.id,
    });
  };

  const keyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      socket.emit(ChatEnum.STOPTYPING, {
        chatId: id as string,
        userId: session.data.user.id,
      });
    }
  };

  const addEmoji = (value: any) => {
    setinputValue((prevState) => prevState + value.native);
  };
  return (
    <Fragment>
      <Chatheader chat={chat} isTyping={isTyping} />
      <Chatbody isLoading={result.isLoading} messages={messages} />
      <footer className="bg-background border-t sticky bottom-0 z-30 flex items-center h-20 py-3 px-2">
        <form onSubmit={submitHandler} className="flex-1">
          <div className="flex items-center space-x-2">
            <EmojiPicker addEmoji={addEmoji} />
            <Input
              disabled={!isConnected}
              placeholder="Type your message..."
              type="text"
              onKeyDown={keydownHandler}
              onKeyUp={keyUpHandler}
              value={inputValue}
              onChange={onChangeHandler}
            />
            <Button disabled={!isConnected}>
              <Icons.send size={17} />
            </Button>
          </div>
        </form>
      </footer>
    </Fragment>
  );
}
