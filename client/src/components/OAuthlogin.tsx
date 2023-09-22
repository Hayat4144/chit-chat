'use client';
import { Button } from '@/components/ui/button';
import { Icons } from './Icons';
import { signIn } from 'next-auth/react';

const SocailProvider = async () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          signIn('google', { callbackUrl: '/' });
        }}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
};

export default SocailProvider;
