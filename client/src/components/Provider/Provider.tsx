'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/context/SocketProvider';

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" enableSystem defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <SocketProvider> {children}</SocketProvider>
        </QueryClientProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
