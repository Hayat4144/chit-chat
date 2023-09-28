'use client';
import React, { Fragment, useEffect, useState } from 'react';
import Chatheader from './Chatheader';
import Chatbody from './Chatbody';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '../Icons';
import { IChat, Message } from '@/types';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import fetchMesages from '@/service/fetchMessage';
import { toast } from '../ui/use-toast';
import sendMessage from '@/service/sendMessage';

interface ChatContainerProps {
  chat: IChat[];
}

export default function ChatContainer({ chat }: ChatContainerProps) {
  const { id } = useParams();
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const session = useSession();
  const [messages, setmessages] = useState<Message[]>([]);
  const [inputValue, setinputValue] = useState<string>('');

  const queryClient = useQueryClient();

  const refetchQuery = () => {
    queryClient.invalidateQueries(['chats']);
    queryClient.refetchQueries(['chats']);
  };

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

  return (
    <Fragment>
      <Chatheader chat={chat} />
      <Chatbody isLoading={result.isLoading} messages={messages} />
      <footer className="bg-background border-t sticky bottom-0 z-30 flex items-center h-20 py-3 px-2">
        <form onSubmit={submitHandler} className="flex-1">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              type="text"
              value={inputValue}
              onChange={onChangeHandler}
            />
            <Button>
              <Icons.send size={17} />
            </Button>
          </div>
        </form>
      </footer>
    </Fragment>
  );
}
