import { toast } from '@/components/ui/use-toast';
import { BASE_URL } from '@/lib/constant';
import { signOut, useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface SocketContextTypes {
  socket: Socket | undefined;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextTypes>({
  socket: undefined,
  isConnected: false,
});

const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isConnected, setConnected] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated' || session.status === 'loading')
      return;
    const token = session.data.user.token;
    const newSocket = io(`${BASE_URL}`, {
      query: {
        token,
      },
    });

    newSocket.on('connected', ({ message }) => {
      if (message) setConnected(true);
    });

    newSocket.on('connect_error', (err) => {
      if (err instanceof Error) {
        setConnected(false);
        const { data, message } = err as any;
        if (data && data.code === 403) {
          toast({ title: message, variant: 'destructive' });
          return signOut({ callbackUrl: '/signin' });
        }
        toast({
          title: message,
          variant: 'destructive',
          description: 'please try again later.',
        });
        return;
      }
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setConnected(false);
    };
  }, [session]);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider, useSocket };
