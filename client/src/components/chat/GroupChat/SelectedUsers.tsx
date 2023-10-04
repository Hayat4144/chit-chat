import { Icons } from '@/components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import getNameshortcut from '@/lib/NameShortcut';
import { IUser } from '@/types';
import React from 'react';

interface SelectedUsersProps {
  data: IUser[];
  removeSelectedMember: (id: string) => void;
}

export default function SelectedUsers({
  data,
  removeSelectedMember,
}: SelectedUsersProps) {
  return (
    <ul className="flex flex-wrap space-y-1">
      {data.map((user) => (
        <li key={user._id} className="flex items-center space-x-1 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>
              {getNameshortcut(`${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[12px]">{`${user.firstName} ${user.lastName}`}</span>
          <Button
            className="h-6 w-fit px-1 items-center rounded-full"
            onClick={() => removeSelectedMember(user._id)}
            variant="ghost"
          >
            <Icons.close size={15} />
          </Button>
        </li>
      ))}
    </ul>
  );
}
