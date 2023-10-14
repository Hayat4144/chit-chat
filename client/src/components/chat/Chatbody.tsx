'use client';

import { cn } from '@/lib/utils';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '../Icons';
import { Skeleton } from '../ui/skeleton';
import { Message } from '@/types';
import { useSession } from 'next-auth/react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '../ui/tooltip';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [imageModalOpen, setimageModalOpen] = React.useState(false);
  const [imageUrl, setimageUrl] = useState<string>('');

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
      <ScrollArea className="px-3 md:px-5 lg:px-10 py-3 flex-1">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-md md:max-w-lg flex-col gap-2 rounded-md text-sm',
                message.sender === session.data.user.id
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted',
              )}
            >
              <MessageContent
                message={message}
                setimagemodel={setimageModalOpen}
                setimageUrl={setimageUrl}
              />
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
      {imageModalOpen ? (
        <ImageModal setModalOpen={setimageModalOpen} imageUrl={imageUrl} />
      ) : null}
    </Fragment>
  );
}

interface MessageContentProps {
  message: Message;
  setimagemodel: (value: boolean) => void;
  setimageUrl: (value: string) => void;
}

const MessageContent = ({
  message,
  setimagemodel,
  setimageUrl,
}: MessageContentProps) => {
  const session = useSession();
  switch (message.payload.type) {
    case 'text':
      return <p className="px-2 py-2 ">{message.payload.content}</p>;
    case 'image':
      return (
        <Fragment>
          <div
            className={cn(
              'w-[300px] rounded-md',
              message.sender === session.data.user.id
                ? ' bg-primary text-primary-foreground'
                : 'bg-muted',
            )}
            onClick={() => {
              setimagemodel(true);
              setimageUrl(message.payload.url.file_url);
            }}
          >
            <img
              alt="Photo by Drew Beamer"
              src={`http://localhost:8000/${message.payload.url.preview.url}`}
              className="rounded-md h-full w-full"
              loading="lazy"
            />
            {message.payload.url.content ? (
              <p className="px-2 py-1">{message.payload.url.content}</p>
            ) : null}
          </div>
        </Fragment>
      );
    default:
      return;
  }
};

const ImageModal = ({
  setModalOpen,
  imageUrl,
}: {
  setModalOpen: (value: boolean) => void;
  imageUrl: string;
}) => {
  return (
    <div className="absolute w-full z-50 bg-background h-full flex flex-col">
      <div
        className="h-[69px] sticky w-full top-0 z-30 border-b flex items-center 
      space-x-2 md:space-x-5 px-2 justify-between md:px-5"
      >
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full h-8 w-8"
                  variant="ghost"
                  size="icon"
                >
                  <Icons.close size={17} onClick={() => setModalOpen(false)} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go Back</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <h1 className="text-xl">Media</h1>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="w-8 h-8 rounded-full"
                    variant="ghost"
                    size="icon"
                  >
                    <Icons.verticalThreeDots size={17} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="flex flex-col px-1 ">
                  <Button className="w-full justify-start py-1" variant="ghost">
                    Download
                  </Button>
                  <Button className="w-full justify-start py-1" variant="ghost">
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent align="end">Menu</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="md:mx-16 mx-5 my-2 flex items-center flex-1">
        <AspectRatio ratio={16 / 8} className="my-0">
          <Image
            src={`http://localhost:8000/${imageUrl}`}
            alt="pic"
            fill
            className="rounded-md object-fill"
          />
        </AspectRatio>
      </div>
    </div>
  );
};
