import { io } from "socket.io-client";
let socket = null;
export const connectSocket = (token) => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            ...(token ? { auth: { token } } : {})
        });
        return socket;
    }
    const currentToken = socket.auth?.token;
    if (token && currentToken !== token) {
        socket.auth = { token };
        if (socket.connected) {
            socket.disconnect();
        }
        socket.connect();
    }
    else if (!socket.connected) {
        socket.connect();
    }
    return socket;
};
export const getSocket = () => socket;
export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};
