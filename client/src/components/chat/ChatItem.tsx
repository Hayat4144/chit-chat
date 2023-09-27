import React, { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IChat } from '@/types';
import { useParams } from 'next/navigation';

interface ChatItemProps {
  data: IChat;
}

export default function ChatItem({ data }: ChatItemProps) {
  const { id } = useParams();
  return (
    <Fragment>
      <div
        className={`flex items-center space-x-3 hover:bg-accent
      rounded-md py-1 cursor-pointer ${data._id === id ? 'bg-accent' : ''}`}
      >
        <Avatar>
          <AvatarImage src={'slfj'} />
          <AvatarFallback>
            {data.isGroupchat
              ? data.groupShortcut
              : data.members[0].profileShortcutName}
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="text-sm font-medium leading-none capitalize">
            {data.name}
          </p>
          {data.lastMessage?.payload.type === 'text' ? (
            <p className="text-sm text-muted-foreground">
              {data.lastMessage.payload.content}
            </p>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}
