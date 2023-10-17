import AsideNavbar from '@/components/Navbar/AsideNavbar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/signin');
  }
  return (
    <main className="flex">
      <AsideNavbar className="h-screen fixed w-full md:border-r md:w-[35%] lg:w-[30%]" />
      <section className="hidden md:flex md:flex-col md:flex-grow h-full md:ml-[35%] lg:ml-[30%]">
        <h1 className="my-2 md:my-5 mx-2 md:mx-5 text-3xl font-medium">Unlease the joy of Conversations! Your Chit-Chat Oasis Awaits</h1>
      </section>
    </main>
  );
}
