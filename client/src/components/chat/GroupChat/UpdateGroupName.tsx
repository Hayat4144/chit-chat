import React, { Fragment, useState } from 'react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { IChat } from '@/types';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/Icons';
import updateGroupName from '@/service/updateName';
import { useParams } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface UpdateGroupNameProps {
  chat: IChat;
  name: string;
}

export default function UpdateGroupName({ chat, name }: UpdateGroupNameProps) {
  const [isInputopen, setisInputopen] = useState<boolean>(false);
  const [inputvalue, setinputvalue] = useState(name);
  const session = useSession();
  const params = useParams();
  const onSubmit = async () => {
    const { data, error } = await updateGroupName(
      session.data.user.token,
      inputvalue,
      params.id as string,
    );
    if (error) {
      toast({ title: error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Group name has been updated successfully.' });
    setisInputopen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      {isInputopen ? (
        <div className="flex items-center space-x-2">
          <input
            autoFocus
            value={inputvalue}
            onChange={(e) => setinputvalue(e.target.value)}
            className="border-b px-2 py-2 placeholder:text-muted-foreground 
                  text-foreground outline-none bg-background focus:-accent-foreground"
          />
          <div className="flex item-center space-x-2">
            <ActionButton action="submit" onClick={onSubmit}>
              <Icons.check size={18} />
            </ActionButton>
            <ActionButton action="close" onClick={() => setisInputopen(false)}>
              <Icons.close size={18} />
            </ActionButton>
          </div>
        </div>
      ) : (
        <h3 className="text-xl font-medium">{name}</h3>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!isInputopen && chat.admin === session.data.user.id ? (
              <Icons.edit
                size={18}
                onClick={() => setisInputopen(true)}
                className="cursor-pointer"
              />
            ) : null}
          </TooltipTrigger>
          <TooltipContent>
            <p>click to edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: 'submit' | 'close';
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, action, ...props }, ref) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger ref={ref} {...props}></TooltipTrigger>
          <TooltipContent>
            <p>{action === 'close' ? 'click to close' : 'click to save'} </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
