'use client';

import { cn } from '@/lib/utils';
import React, { Fragment, useEffect, useRef } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '../Icons';
import { Skeleton } from '../ui/skeleton';
import { Message } from '@/types';
import { useSession } from 'next-auth/react';

interface ChatbodyProps {
  messages: Message[];
  isLoading: boolean;
}

export default function Chatbody({ messages, isLoading }: ChatbodyProps) {
  const lastMessageRef = useRef<HTMLDivElement>();
  const session = useSession();
  const [showScrollButton, setShowScrollButton] =
    React.useState<boolean>(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          !entry.isIntersecting
            ? setShowScrollButton(true)
            : setShowScrollButton(false);
        });
      },
      { threshold: 0.5 },
    );

    if (lastMessageRef.current) {
      observer.observe(lastMessageRef.current);
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return () => {
      if (lastMessageRef.current) {
        observer.unobserve(lastMessageRef.current);
      }
    };
  }, [messages]);

  const lastMessageViewHandle = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <Fragment>
        <div className="px-3 md:px-5 lg:px-10 py-3 flex-1">
          <div className="flex flex-col space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                className={cn(
                  'flex w-52 flex-col gap-2 rounded-lg px-3 py-2 text-sm h-10',
                  item % 2 === 0 ? 'ml-auto' : 'bg-muted',
                )}
              />
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <ScrollArea className="px-3 md:px-5 lg:px-10 py-3 relative flex-1">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.sender === session.data.user.id
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted',
              )}
            >
              {message.payload.content}
            </div>
          ))}
        </div>
        <div
          className={`${
            showScrollButton ? 'absolute bottom-2 right-5' : 'hidden'
          }`}
        >
          <Button
            variant="secondary"
            className="rounded-full"
            size="icon"
            onClick={lastMessageViewHandle}
          >
            <Icons.chevronDown size={17} />
          </Button>
        </div>
        <div ref={lastMessageRef}></div>
      </ScrollArea>
    </Fragment>
  );
}
