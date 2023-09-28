import AsideNavbar from '@/components/Navbar/AsideNavbar';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <AsideNavbar className="h-screen fixed w-full md:border-r md:w-[35%] lg:w-[30%] hidden md:block" />
      {children}
    </div>
  );
}
