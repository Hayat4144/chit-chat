'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';

export default function Chatbody() {
  const [messages, setMessages] = React.useState([
    {
      role: 'agent',
      content: 'Hi, how can I help you today?',
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: 'agent',
      content: 'What seems to be the problem?',
    },
    {
      role: 'user',
      content: "I can't log in.",
    },
    {
      role: 'user',
      content: "I can't log in.",
    },
    {
      role: 'agent',
      content: 'Hi, how can I help you today?',
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: 'agent',
      content: 'What seems to be the problem?',
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: 'agent',
      content: 'What seems to be the problem?',
    },
    {
      role: 'user',
      content: "I can't log in.",
    },
    {
      role: 'agent',
      content: 'Hi, how can I help you today?',
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: 'agent',
      content: 'What seems to be the problem?',
    },
    {
      role: 'user',
      content: "Hey, I'm having trouble with my account.",
    },
  ]);
  return (
    <ScrollArea className="px-3 md:px-5 lg:px-10 py-3">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
              message.role === 'user'
                ? 'ml-auto bg-primary text-primary-foreground'
                : 'bg-muted',
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
