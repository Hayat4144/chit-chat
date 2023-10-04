'use client';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Icons } from '../Icons';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import GroupUserItem from '@/components/chat/GroupChat/GroupUserItem';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { BASE_URL } from '@/lib/constant';
import getNameshortcut from '@/lib/NameShortcut';
import debounce from 'lodash.debounce';
import SearchUsers from '@/service/SearchUser';
import { IUser } from '@/types';
import SelectedUsers from './GroupChat/SelectedUsers';
import NextPrevButtons from './GroupChat/NextPrevButtons';
import CreategroupTab from './GroupChat/CreategroupTab';

export default function NewGroup() {
  const [members, setmembers] = useState<IUser[]>([]);
  const session = useSession();
  const [isFetched, toggleFetch] = useState<boolean>(false);
  const [searchTerm, setsearchTerm] = useState<string>('');
  const [activetab, setactivetab] = useState<string>('members');
  const [selectedUsers, setSelectedUsers] = useState([]);

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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setsearchTerm(e.target.value);
    debouceRequest(e.target.value);
  };

  const formatedUser = (data: IUser[]) => {
    const formatedUser = data.map((item) => {
      const shortcutName = getNameshortcut(
        `${item.firstName} ${item.lastName}`,
      );
      return { ...item, profileShortcutName: shortcutName };
    });
    setmembers(formatedUser);
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

  const handleUserSelect = (userData: IUser) => {
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

  const removeSelectedMember = (id: string) => {
    if (!id) return;
    setmembers((prevUser) => [
      ...prevUser,
      selectedUsers.find((user) => user._id === id),
    ]);
    setSelectedUsers((prevUser) => prevUser.filter((user) => user._id !== id));
  };

  return (
    <Sheet>
      <SheetTrigger className="flex items-center space-x-2">
        <Icons.add size={17} />
        <span>New Group</span>
      </SheetTrigger>
      <SheetContent className="h-full">
        <Tabs
          defaultValue="members"
          value={activetab}
          className="h-full relative"
        >
          <TabsContent value="members" className="h-full">
            <SheetHeader className="text-left">
              <SheetTitle>Add group participants </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 my-2 relative">
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
              <ScrollArea>
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
            </div>
            {selectedUsers.length > 0 ? (
              <NextPrevButtons
                activeTab={activetab}
                setactivetab={setactivetab}
              />
            ) : null}
          </TabsContent>
          <TabsContent value="createGroup">
            <CreategroupTab seletecusers={selectedUsers} />
            <NextPrevButtons
              activeTab={activetab}
              setactivetab={setactivetab}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
