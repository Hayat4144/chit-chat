import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Icons } from '@/components/Icons';
import { BASE_URL } from '@/lib/constant';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { IChat, IUser } from '@/types';
import getNameshortcut from '@/lib/NameShortcut';
import { toast } from '@/components/ui/use-toast';
import SelectedUsers from '@/components/chat/GroupChat/SelectedUsers';
import SearchUsers from '@/service/SearchUser';
import debounce from 'lodash.debounce';
import { ScrollArea } from '@/components/ui/scroll-area';
import GroupUserItem from '@/components/chat/GroupChat/GroupUserItem';
import { Button } from '@/components/ui/button';
import addParticipants from '@/service/addParticipants';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';

interface AddParticipantsProps {
  chat: IChat;
}

export default function AddParticipants({ chat }: AddParticipantsProps) {
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const [isSubmited, setisSubmited] = useState<boolean>(false);
  const [open, setopen] = useState<boolean>(false);
  const [searchTerm, setsearchTerm] = useState<string>('');
  const [members, setmembers] = useState<IUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const session = useSession();
  const params = useParams();

  const recentChatMember = async (token: string | undefined) => {
    const url = `${BASE_URL}/api/v1/recent/chat/members`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const { error, data } = await res.json();
    if (res.status !== 200) {
      return { error };
    }
    return { data };
  };

  const result = useQuery(
    ['recentChatMember'],
    () => {
      return recentChatMember(session.data.user.token);
    },
    {
      enabled: isFetched,
    },
  );

  const formatedUser = (data: IUser[]) => {
    const formatedUser = data.map((item) => {
      const shortcutName = getNameshortcut(
        `${item.firstName} ${item.lastName}`,
      );
      return { ...item, profileShortcutName: shortcutName };
    });
    setmembers(formatedUser);
  };

  const getResults = async (search: string) => {
    if (search.length > 2) {
      const { data, error } = await SearchUsers(
        session.data.user.token,
        search,
      );
      if (error) return toast({ title: error, variant: 'destructive' });
      formatedUser(data);
    }
  };

  const request = debounce(
    (searchString: string) => getResults(searchString),
    500,
  );

  const debouceRequest = useCallback(
    (searchString: string) => request(searchString),
    [],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(e.target.value);
    debouceRequest(e.target.value);
  };

  const handleUserSelect = (userData: IUser) => {
    const isUserExistinGroup = chat.members.some(
      (member) => member._id === userData._id,
    );
    if (isUserExistinGroup) {
      setmembers(members.filter((member) => member._id !== userData._id));
      return toast({
        title: `${userData.firstName} ${userData.lastName} already exist in group.`,
        description: 'Try to add another user',
      });
    }
    const isUserSelected = selectedUsers.some(
      (user) => user._id === userData._id,
    );
    if (isUserSelected) {
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user._id !== userData._id),
      );
    } else {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userData]);
    }
    setmembers((prevState) =>
      prevState.filter((member) => member._id !== userData._id),
    );
  };

  useEffect(() => {
    if (session.data?.user.token) {
      toggleFetch(true);
      return;
    }
  }, [session]);

  useEffect(() => {
    if (result.data) {
      const { data, error } = result.data as { data: IUser[]; error: any };
      if (error) {
        toast({ title: error, variant: 'destructive' });
        return;
      }
      formatedUser(data);
    }
  }, [result.data, result.isLoading]);

  const removeSelectedMember = (id: string) => {
    if (!id) return;
    setmembers((prevUser) => [
      ...prevUser,
      selectedUsers.find((user) => user._id === id),
    ]);
    setSelectedUsers((prevUser) => prevUser.filter((user) => user._id !== id));
  };

  const onSubmitHandler = async () => {
    setisSubmited(true);
    const { data, error } = await addParticipants(
      session.data.user.token,
      selectedUsers,
      params.id as string,
    );
    setisSubmited(false);
    if (error) {
      toast({ title: error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Members have been added successfully.' });
    setopen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setopen}>
      <SheetTrigger>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div
            className="px-2 rounded-full h-10  w-10 bg-accent
              flex flex-col items-center py-2 my-4"
          >
            <Icons.user size={28} />
          </div>
          <h1 className="text-xl">Add participants</h1>
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Add group participants </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-3 my-2 sticky top-0">
          {selectedUsers.length > 0 ? (
            <SelectedUsers
              removeSelectedMember={removeSelectedMember}
              data={selectedUsers}
            />
          ) : null}
          <div className="mb-1">
            <input
              className="w-full bg-transparent border-b outline-none text-foreground
              py-1 placeholder:text-muted-foreground "
              placeholder="Type contact name"
              type="text"
              value={searchTerm}
              onChange={onChange}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {members.length > 0 ? (
            members.map((memeber) => (
              <GroupUserItem
                key={memeber._id}
                data={memeber}
                onUserSelect={handleUserSelect}
              />
            ))
          ) : (
            <Fragment>
              <p>Oops, No user found.</p>
            </Fragment>
          )}
        </ScrollArea>
        <div className="sticky bottom-5 w-full">
          <Button
            className="w-full"
            onClick={onSubmitHandler}
            disabled={isSubmited}
          >
            {isSubmited ? (
              <Fragment>
                <Loader size={18} className="animate-spin mr-2" />
                <span>please wait</span>
              </Fragment>
            ) : (
              'Add participants'
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
