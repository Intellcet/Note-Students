import React, { useContext } from 'react';
import io from 'socket.io-client';

type SocketContextType = SocketIOClient.Socket;

type SocketProviderProps = {
  children: React.ReactNode;
};

const initSocketContext = () => io('http://localhost:8080');

const SocketContext = React.createContext<SocketContextType>(
  initSocketContext()
);

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
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
