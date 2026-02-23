import { useEffect } from "react";
import { connectSocket, getSocket } from "@/lib/socket";
import { useCallStore } from "@/store/call.store";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { useMessageStore } from "@/store/message.store";
import type { CallSignalPayload } from "@lumio/shared";

export const useSocketEvents = (): void => {
  const setCall = useCallStore((state) => state.setCall);
  const me = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const chats = useChatStore((state) => state.chats);
  const loadChats = useChatStore((state) => state.loadChats);
  const applyIncomingMessage = useChatStore((state) => state.applyIncomingMessage);
  const updateUserPresence = useChatStore((state) => state.updateUserPresence);
  const addMessage = useMessageStore((state) => state.addMessage);
  const setTyping = useMessageStore((state) => state.setTyping);

  useEffect(() => {
    if (!me) return;
    connectSocket(accessToken ?? undefined);
    const socket = getSocket();
    if (!socket || !me) return;

    const onOffer = (payload: CallSignalPayload): void => {
      if (payload.fromUserId === me.id) return;
      setCall({
        open: false,
        chatId: payload.chatId,
        peerUserId: payload.fromUserId,
        type: payload.callType,
        incoming: true,
        signalSdp: payload.sdp
      });
    };

    const onEnd = (payload: { chatId: string; fromUserId: string }): void => {
      const callState = useCallStore.getState();
      if (callState.chatId !== payload.chatId || callState.peerUserId !== payload.fromUserId) return;
      setCall({ open: false, incoming: false, signalSdp: null });
    };

    const onMessage = (message: Parameters<typeof addMessage>[0]): void => {
      addMessage(message);
      const updated = applyIncomingMessage(message, me.id);
      if (!updated) {
        void loadChats();
      }
    };

    const onTyping = (payload: { chatId: string; username: string; isTyping: boolean }): void => {
      setTyping(payload.chatId, payload.username, payload.isTyping);
    };

    const onUserOnline = (payload: { userId: string }): void => {
      updateUserPresence(payload.userId, true);
    };

    const onUserOffline = (payload: { userId: string; lastSeen: string }): void => {
      updateUserPresence(payload.userId, false, payload.lastSeen);
    };

    socket.on("call_offer", onOffer);
    socket.on("call_end", onEnd);
    socket.on("new_message", onMessage);
    socket.on("user_typing", onTyping);
    socket.on("user_online", onUserOnline);
    socket.on("user_offline", onUserOffline);

    for (const chat of chats) {
      socket.emit("join_chat", { chatId: chat.id });
    }

    return () => {
      socket.off("call_offer", onOffer);
      socket.off("call_end", onEnd);
      socket.off("new_message", onMessage);
      socket.off("user_typing", onTyping);
      socket.off("user_online", onUserOnline);
      socket.off("user_offline", onUserOffline);
    };
  }, [me, accessToken, chats, setCall, addMessage, setTyping, applyIncomingMessage, loadChats, updateUserPresence]);
};
