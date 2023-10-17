'use client'
import React, { Fragment } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../Icons';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import NewGroup from '../chat/NewGroup';
import { signOut } from 'next-auth/react';
import { toast } from '../ui/use-toast';

export default function Menu() {
const logout = ()=>{
    signOut()
    toast({title:'you are logout successfully.'})
}
  return (
    <Fragment>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="rounded-full" variant="ghost" size="icon">
            <Icons.verticalThreeDots size={17} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <Command>
            <CommandInput placeholder="Search menu..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>
                  <NewGroup />
                </CommandItem>
                <CommandItem className="flex items-center space-x-2">
                  <Icons.settings size={17} />
                  <span>settings</span>
                </CommandItem>
                <CommandItem className="flex items-center space-x-2 cursor-pointer"
                onSelect={()=>logout()}>
                  <Icons.logout size={17} />
                  <span>Logout</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Fragment>
  );
}
