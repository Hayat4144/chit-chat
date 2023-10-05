import ChatContainer from '@/components/chat/ChatContainer';
import { authOptions } from '@/lib/auth';
import formatedChat from '@/lib/formatedChat';
import createChatOrGetChat from '@/service/createChatOrGetChat';
import particularChat from '@/service/particularChat';
import { IChat } from '@/types';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  let formatedData: IChat[];
  if (searchParams.isUserId) {
    const { data, error } = await createChatOrGetChat(
      session.user.token,
      params.id,
    );
    if (error) throw error;
    formatedData = formatedChat([data], session);
    redirect(`/chat/${formatedData[0]._id}`)
  } else {
    const { data, error } = await particularChat(session.user.token, params.id);
    if (error) throw error;
    formatedData = formatedChat([data], session);
  }
  return (
    <main className="flex flex-col flex-grow h-screen md:ml-[35%] lg:ml-[30%] ">
      <ChatContainer chat={formatedData} />
    </main>
  );
}
