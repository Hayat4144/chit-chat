import ChatContainer from '@/components/chat/ChatContainer';
import { authOptions } from '@/lib/auth';
import formatedChat from '@/lib/formatedChat';
import particularChat from '@/service/particularChat';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  const { data, error } = await particularChat(session.user.token, params.id);
  if (error) throw error;
  const formatedData = formatedChat([data], session);
  return (
    <main className="flex flex-col flex-grow h-screen md:ml-[35%] lg:ml-[30%] ">
      <ChatContainer chat={formatedData} />
    </main>
  );
}
