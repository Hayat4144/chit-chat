import { useParams } from 'next/navigation';
import React, { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getNameshortcut from '@/lib/NameShortcut';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../Icons';
import { Button } from '../ui/button';
import { IChat } from '@/types';

interface ChatHeaderProps {
  chat: IChat[];
  isTyping: boolean;
}

export default function Chatheader({ chat, isTyping }: ChatHeaderProps) {
  let profileImage: string;
  let nameshortcut: string;
  let name: string;
  if (chat[0].isGroupchat) {
    nameshortcut = getNameshortcut(`${chat[0].name}`);
    profileImage = (chat[0] as any).profileImage;
    name = chat[0].name;
  } else {
    nameshortcut = getNameshortcut(
      `${chat[0].members[0].firstName} ${chat[0].members[0].firstName}`,
    );
    profileImage = chat[0].members[0].profileImage;
    name = `${chat[0].members[0].firstName} ${chat[0].members[0].lastName} `;
  }

  return (
    <Fragment>
      <header className="border-b sticky top-0 z-10 py-3">
        <div className="px-2 md:px-5 flex items-center pb-1 justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={profileImage} />
              <AvatarFallback>{nameshortcut}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-medium leading-none capitalize">
                {name}
              </p>
              <p>
                {isTyping ? (
                  <>
                    typing <span className="animate-ping">...</span>
                  </>
                ) : (
                  'offline'
                )}
              </p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="rounded-full" variant="ghost" size="icon">
                <Icons.verticalThreeDots size={17} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">hello</PopoverContent>
          </Popover>
        </div>
      </header>
    </Fragment>
  );
}
