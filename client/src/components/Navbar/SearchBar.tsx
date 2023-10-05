'use client';
import React, { Fragment, useCallback, useState } from 'react';
import { Input } from '../ui/input';
import { useSession } from 'next-auth/react';
import SearchUsers from '@/service/SearchUser';
import { toast } from '../ui/use-toast';
import { IUser } from '@/types';
import getNameshortcut from '@/lib/NameShortcut';
import debounce from 'lodash.debounce';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icons } from '../Icons';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function SearchBar() {
  const [users, setusers] = useState<IUser[]>([]);
  const [searchterm, setsearchterm] = useState('');
  const [open, setOpen] = React.useState(false);
  const session = useSession();
  const formatedUser = (data: IUser[]) => {
    const formatedUser = data.map((item) => {
      const shortcutName = getNameshortcut(
        `${item.firstName} ${item.lastName}`,
      );
      return { ...item, profileShortcutName: shortcutName };
    });
    setusers(formatedUser);
  };

  const getResults = async (search: string) => {
    if (search.length > 2) {
      const { data, error } = await SearchUsers(
        session?.data.user.token,
        search,
      );
      if (error) return toast({ title: error, variant: 'destructive' });
      formatedUser(data);
      setOpen(true);
    }
  };

  const request = debounce(
    (searchString: string) => getResults(searchString),
    500,
  );

  const debouceRequest = useCallback(
    (searchString: string) => request(searchString),
    [session],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setsearchterm(e.target.value);
    debouceRequest(e.target.value);
  };

  return (
    <Fragment>
      <div className="w-full relative z-50">
        <Input
          placeholder="Search or Start a new chat"
          type="text"
          value={searchterm}
          onChange={onChange}
        />
        <div
          className={`${
            open ? 'absolute' : 'hidden'
          } mt-1 bg-background min-h-[10em] w-full`}
        >
          <div className="flex items-center justify-between my-1">
            <p>{`you searched for: ${searchterm}`} </p>
            <Button
              className="rounded-full w-8 h-8"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <Icons.close size={17} />
            </Button>
          </div>
          {users.length > 0 ? (
            <Fragment>
              {users.map((data) => (
                <Link
                  key={data._id}
                  href={`/chat/${data._id}?isUserId=${true}`}
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
                </Link>
              ))}
            </Fragment>
          ) : (
            <Fragment>No User has been found</Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
