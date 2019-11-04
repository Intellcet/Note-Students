import React, { useContext, useMemo, useState } from 'react';
import io, { Server } from 'socket.io';

type SocketContextType = {
  socket: Server;
};

type SocketProviderProps = {
  children: React.ReactNode;
};

const initSocketContext = () => io('http://localhost:8080');

const SocketContext = React.createContext<SocketContextType>({
  socket: initSocketContext(),
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error(
      'You cannot use socket context outside of SocketProvider component'
    );

  return context;
};

const SocketProvider = (props: SocketProviderProps): React.ReactElement => {
  const { children } = props;
  const [socket, setSocket] = useState({
    socket: initSocketContext(),
  });
  useSocket();
  const contextValue = useMemo(() => socket, [socket]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
