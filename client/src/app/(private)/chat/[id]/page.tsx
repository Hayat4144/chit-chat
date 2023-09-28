import ChatContainer from '@/components/chat/ChatContainer';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  return (
    <main className="flex flex-col flex-grow h-screen md:ml-[35%] lg:ml-[30%] ">
      <ChatContainer />
    </main>
  );
}
