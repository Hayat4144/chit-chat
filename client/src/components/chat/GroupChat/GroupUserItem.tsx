import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  profileShortcutName?: string;
}
interface ChatItemProps {
  data: IUser;
  onUserSelect: (data: IUser) => void;
}

export default function GroupUserItem({ data, onUserSelect }: ChatItemProps) {
  const handleCheckboxChange = () => {
    onUserSelect(data);
  };
  return (
    <div
      onClick={handleCheckboxChange}
      className={`flex items-center space-x-3 hover:bg-accent
      rounded-md py-1 cursor-pointer`}
    >
      <Avatar>
        <AvatarImage src={data.profilePicture} />
        <AvatarFallback>{data.profileShortcutName}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <p className="text-sm font-medium leading-none capitalize">
          {`${data.firstName} ${data.lastName}`}
        </p>
      </div>
    </div>
  );
}
