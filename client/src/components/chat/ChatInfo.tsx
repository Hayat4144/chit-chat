import React, { Fragment } from 'react';
import { Icons } from '../Icons';
import { Button } from '../ui/button';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '../ui/tooltip';
import { IChat } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { useSession } from 'next-auth/react';
import RemoveParticipant from './RemoveParticipant';
interface ChatInfoProps {
  chat: IChat;
  name: string;
  profileImage: string;
  nameshortcut: string;
  setopen: (value: boolean) => void;
}
export default function ChatInfo({
  setopen,
  chat,
  name,
  nameshortcut,
  profileImage,
}: ChatInfoProps) {
  const session = useSession();
  return (
    <div className="absolute w-full z-50 bg-background h-full flex flex-col">
      <div className="h-[69px] sticky w-full top-0 z-30 border-b flex items-center space-x-2 md:space-x-5 px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="rounded-full h-8 w-8"
                variant="ghost"
                size="icon"
              >
                <Icons.close size={17} onClick={() => setopen(false)} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go Back</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h1 className="text-xl">
          {chat.isGroupchat ? 'Group Info' : 'Chat Info'}
        </h1>
      </div>
      <div className="flex-1 z-20 overflow-y-auto">
        <div className="flex flex-col items-center mx-auto py-5">
          <Avatar className="w-40 h-40 text-3xl">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{nameshortcut}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-medium">{name}</h3>
        </div>
        <Separator orientation="horizontal" className="w-full" />
        <div className="participants px-2 md:px-5 my-2">
          <h1>{chat.members.length} participants</h1>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div
              className="px-2 rounded-full h-12 w-12 bg-accent
              flex flex-col items-center py-2 my-4"
            >
              <Icons.user size={28} />
            </div>
            <h1 className="text-xl">Add participants</h1>
          </div>
          {chat.isGroupchat
            ? chat.members.map((member) => (
                <div
                  key={member._id}
                  className={`flex items-center justify-between hover:bg-accent
                      rounded-md py-1 cursor-pointer w-full`}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar>
                      <AvatarImage src={member.profileImage} />
                      <AvatarFallback>
                        {member.profileShortcutName}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <p className="text-sm font-medium leading-none capitalize">
                        {`  ${member.firstName} ${member.lastName}`}
                      </p>
                    </div>
                  </div>
                  {member._id !== session.data.user.id ? (
                    <Fragment>
                      <RemoveParticipant id={member._id} />
                    </Fragment>
                  ) : (
                    <p className="px-1 py-1 bg-accent text-[12px] rounded-md">
                      Group Admin
                    </p>
                  )}
                </div>
              ))
            : null}
        </div>
        <div className="px-2 md:px-5 my-5">
          <div
            className="clear-chat text-red-700 text-xl flex items-center 
            space-x-2 cursor-pointer"
          >
            <Icons.trash size={18} />
            <p>Delete chat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
