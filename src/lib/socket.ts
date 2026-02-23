import { io, type Socket } from "socket.io-client";
import type { SocketClientToServer, SocketServerToClient } from "@lumio/shared";

let socket: Socket<SocketServerToClient, SocketClientToServer> | null = null;

export const connectSocket = (token?: string): Socket<SocketServerToClient, SocketClientToServer> => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      ...(token ? { auth: { token } } : {})
    });
    return socket;
  }

  const currentToken = (socket.auth as { token?: string } | undefined)?.token;
  if (token && currentToken !== token) {
    socket.auth = { token };
    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();
  } else if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const getSocket = (): Socket<SocketServerToClient, SocketClientToServer> | null => socket;

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
};
