import { create } from "zustand";
import type { CursorPage, MessageDto } from "@lumio/shared";
import { api } from "@/lib/api";

interface MessageState {
  byChatId: Record<string, MessageDto[]>;
  cursorByChatId: Record<string, string | null>;
  typingUsers: Record<string, string[]>;
  loadMessages: (chatId: string, append?: boolean) => Promise<void>;
  addMessage: (message: MessageDto) => void;
  setTyping: (chatId: string, username: string, isTyping: boolean) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  byChatId: {},
  cursorByChatId: {},
  typingUsers: {},
  loadMessages: async (chatId, append = false) => {
    const cursor = append ? get().cursorByChatId[chatId] : undefined;
    const { data } = await api.get<CursorPage<MessageDto>>(`/chats/${chatId}/messages`, {
      params: { cursor, limit: 50 }
    });

    const prev = get().byChatId[chatId] ?? [];
    set({
      byChatId: {
        ...get().byChatId,
        [chatId]: append ? [...prev, ...data.data] : data.data
      },
      cursorByChatId: {
        ...get().cursorByChatId,
        [chatId]: data.nextCursor
      }
    });
  },
  addMessage: (message) => {
    const current = get().byChatId[message.chatId] ?? [];
    const existingIndex = current.findIndex((x) => x.id === message.id);
    const next =
      existingIndex >= 0
        ? current.map((item, index) => (index === existingIndex ? message : item))
        : [message, ...current];
    set({ byChatId: { ...get().byChatId, [message.chatId]: next } });
  },
  setTyping: (chatId, username, isTyping) => {
    const setForChat = new Set(get().typingUsers[chatId] ?? []);
    if (isTyping) setForChat.add(username);
    else setForChat.delete(username);
    set({ typingUsers: { ...get().typingUsers, [chatId]: Array.from(setForChat) } });
  }
}));
