'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react';

export default function Signout() {
  return <Button onClick={() => signOut()}>logout</Button>;
}
