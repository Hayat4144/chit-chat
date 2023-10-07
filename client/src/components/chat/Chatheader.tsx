import React, { Fragment, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getNameshortcut from '@/lib/NameShortcut';
import { IChat } from '@/types';
import ChatInfo from './ChatInfo';
import moment from 'moment';
import formatLastSeen from '@/lib/formatLastSeen';

interface userStatus {
  _id: string;
  user: string;
  lastSeen: Date;
  online: boolean;
  relativeTime?: string;
}

interface ChatHeaderProps {
  chat: IChat[];
  isTyping: boolean;
  status: userStatus | null;
}

export default function Chatheader({
  chat,
  isTyping,
  status,
}: ChatHeaderProps) {
  const [open, setopen] = useState<boolean>(false);
  let userStatus = status;
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
  if (userStatus) {
    userStatus.lastSeen = moment(userStatus.lastSeen).toDate();
    userStatus.relativeTime = formatLastSeen(userStatus.lastSeen);
  }

  return (
    <Fragment>
      {open ? (
        <ChatInfo
          setopen={setopen}
          chat={chat[0]}
          profileImage={profileImage}
          name={name}
          nameshortcut={nameshortcut}
        />
      ) : null}
      <header className="border-b sticky top-0 z-10 py-3">
        <div className="px-2 md:px-5 flex items-center pb-1 justify-between">
          <div
            className="flex items-center space-x-3"
            onClick={() => setopen(true)}
          >
            <Avatar>
              <AvatarImage src={profileImage} />
              <AvatarFallback>{nameshortcut}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-medium leading-none capitalize">
                {name}
              </p>
              <p className='text-muted-foreground text-sm'>
                {isTyping
                  ? 'typing...'
                  : userStatus
                  ? userStatus.online
                    ? 'online'
                    : userStatus.relativeTime
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
}
