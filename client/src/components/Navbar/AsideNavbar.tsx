import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React, { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Menu from './Menu';
import { Separator } from '@/components/ui/separator';
import SearchBar from './SearchBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Chats from '../chat/Chats';
import getNameshortcut from '@/lib/NameShortcut';
import { cn } from '@/lib/utils';
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default async function AsideNavbar({ className }: SidebarProps) {
  const session = await getServerSession(authOptions);
  return (
    <Fragment>
      <aside
        className={cn(
          'md:w-[35%] md:fixed md:top-0 left-0 lg:w-[30%] md:border-r py-5',
          className,
        )}
      >
        <div className="sticky top-0 left-0">
          <div className="header flex justify-between space-x-2 items-center px-2 pb-2">
            <div className="user-profile flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={session.user?.image} />
                <AvatarFallback>
                  {getNameshortcut(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none capitalize">
                  {session.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            <Menu />
          </div>
          <Separator orientation="horizontal" />
          <div className="px-2 py-2 ">
            <SearchBar />
          </div>
        </div>

        <ScrollArea className="h-full px-2">
          <Chats />
        </ScrollArea>
      </aside>
    </Fragment>
  );
}
