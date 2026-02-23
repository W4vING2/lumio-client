import { create } from "zustand";
import type { ChatSummary, MessageDto } from "@lumio/shared";
import { api } from "@/lib/api";

interface ChatState {
  chats: ChatSummary[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  loadChats: () => Promise<void>;
  applyIncomingMessage: (message: MessageDto, currentUserId: string) => boolean;
}

const sortChats = (chats: ChatSummary[]): ChatSummary[] =>
  [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bTime - aTime;
  });

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  setActiveChatId: (id) =>
    set((state) => ({
      activeChatId: id,
      chats: state.chats.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat))
    })),
  loadChats: async () => {
    const { data } = await api.get<ChatSummary[]>("/chats");
    set({ chats: sortChats(data) });
  },
  applyIncomingMessage: (message, currentUserId) => {
    let updated = false;
    set((state) => {
      const chats = state.chats.map((chat) => {
        if (chat.id !== message.chatId) {
          return chat;
        }
        updated = true;
        const incrementUnread = message.author.id !== currentUserId && state.activeChatId !== message.chatId ? 1 : 0;
        return {
          ...chat,
          lastMessage: message,
          unreadCount: chat.unreadCount + incrementUnread
        };
      });

      if (!updated) return state;
      return { chats: sortChats(chats) };
    });
    return updated;
  }
}));
