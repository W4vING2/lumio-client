import { create } from "zustand";
import { api } from "@/lib/api";
const sortChats = (chats) => [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned)
        return a.isPinned ? -1 : 1;
    const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bTime - aTime;
});
export const useChatStore = create((set) => ({
    chats: [],
    activeChatId: null,
    setActiveChatId: (id) => set((state) => ({
        activeChatId: id,
        chats: state.chats.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat))
    })),
    loadChats: async () => {
        const { data } = await api.get("/chats");
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
            if (!updated)
                return state;
            return { chats: sortChats(chats) };
        });
        return updated;
    },
    updateUserPresence: (userId, isOnline, lastSeen = null) => set((state) => ({
        chats: state.chats.map((chat) => ({
            ...chat,
            members: chat.members.map((member) => member.id === userId
                ? {
                    ...member,
                    isOnline,
                    lastSeen: isOnline ? null : lastSeen
                }
                : member)
        }))
    }))
}));
