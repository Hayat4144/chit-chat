import '../styles/globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Provider from '@/components/Provider/Provider';
import { fontSans } from '@/lib/Fonts';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
