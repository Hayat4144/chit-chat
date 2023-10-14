import AsideNavbar from '@/components/Navbar/AsideNavbar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
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
        <h1 className="text-7xl font-medium">This is chat box.</h1>
        <Image
          src="http://localhost:8000/images/image.jpeg"
          width={400}
          height={400}
          alt="pic"
        />
        <video src="http://localhost:8000/images/c6d96d11-be6e-402e-9073-8f603f5bd280-Sample-MP4-Video-File-Download.mp4"></video>
      </section>
    </main>
  );
}
