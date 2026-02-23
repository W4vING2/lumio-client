import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatArea } from "@/components/chat/ChatArea";
import { getSocket } from "@/lib/socket";
import { useChatStore } from "@/store/chat.store";
import { api } from "@/lib/api";

export const ChatRoutePage = (): JSX.Element => {
  const { id } = useParams();
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);

  useEffect(() => {
    if (!id) return;
    setActiveChatId(id);
    void api.post(`/chats/${id}/read`).catch(() => undefined);
    const socket = getSocket();
    socket?.emit("join_chat", { chatId: id });

    return () => {
      setActiveChatId(null);
      socket?.emit("leave_chat", { chatId: id });
    };
  }, [id, setActiveChatId]);

  if (!id) return <div className="grid h-full place-items-center">Выберите чат</div>;
  return <ChatArea chatId={id} />;
};
