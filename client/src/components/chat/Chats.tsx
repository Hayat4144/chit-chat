'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import fetchChats from '@/service/chats';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { IChat } from '@/types';
import ChatItem from './ChatItem';
import getNameshortcut from '@/lib/NameShortcut';

export default function Chats() {
  const session = useSession();
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const [chats, setchats] = useState<IChat[]>([]);

  const result = useQuery(
    ['chats'],
    () => {
      return fetchChats(session.data?.user.token);
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
      const { data, error } = result.data as { data: IChat[]; error: any };
      if (error) {
        toast({ title: error, variant: 'destructive' });
        return;
      }
      const formatedChat = data.map((item) => {
        if (!item.isGroupchat) {
          const recievers = item.members.filter(
            (member) => member._id !== session.data.user.id,
          );
          const name = `${recievers[0].firstName} ${recievers[0].lastName}`;
          const shortcut = getNameshortcut(name);

          const updatedMembers = recievers.map((member) => {
            if (member._id !== session.data.user.id) {
              return {
                ...member,
                profileShortcutName: shortcut,
              };
            }
            return member; // For other members, keep them unchanged
          });
          return {
            ...item,
            name,
            members: updatedMembers,
          };
        }
        const shortcut = getNameshortcut(item.name);
        return { ...item, groupShortcut: shortcut };
      });
      setchats(formatedChat);
    }
  }, [result.data, result.isLoading]);

  if (result.isLoading) {
    return [1, 2, 3, 4].map((item) => (
      <div
        className="flex items-center space-x-4 md:space-x-2 lg:space-x-4 py-2"
        key={item}
      >
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] md:w-[190px] lg:w-[250px]" />
          <Skeleton className="h-4 w-[200px] md:w-[170px] lg:w-[200px]" />
        </div>
      </div>
    ));
  }

  return (
    <Fragment>
      <div className="flex flex-col space-y-2">
        {chats.length > 0 ? (
          chats.map((chat) => <ChatItem data={chat} key={chat._id} />)
        ) : (
          <Fragment>No chats found</Fragment>
        )}
      </div>
    </Fragment>
  );
}
