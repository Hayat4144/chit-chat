'use client';
import React, { Fragment } from 'react';
import Chatheader from './Chatheader';
import Chatbody from './Chatbody';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../Icons';

export default function ChatContainer() {
  return (
    <Fragment>
      <Chatheader />
      <Chatbody />
      <footer className="bg-background border-t sticky bottom-0 z-30 h-20 py-3 px-2">
        <div className="flex items-center space-x-2">
          <Input placeholder="Type your message..." type="text" />
          <Button>
            <Icons.send size={14} />
            send
          </Button>
        </div>
      </footer>
    </Fragment>
  );
}
