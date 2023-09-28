import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getNameshortcut from '@/lib/NameShortcut';
import { useSession } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../Icons';
import { Button } from '../ui/button';

export default function Chatheader() {
  const { id } = useParams();
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const { data, status } = useSession();
  const result = useQuery(['particularChat'], () => {}, { enabled: isFetched });

  return (
    <Fragment>
      <header className="border-b sticky top-0 z-10 py-3">
        <div className="px-2 md:px-5 flex items-center pb-1 justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={'hello'} />
              <AvatarFallback>{getNameshortcut('Hayat ilyas')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-2xl font-medium leading-none capitalize">
                Hayat ilyas
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
    // <div className="flex items-center px-2 pb-2 py-3 border-b w-full fixed top-0 z-50 bg-background">
    //   <div className="user-profile flex items-center space-x-4">
    //         //   </div>
    //       // </div>
  );
}
