import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ChatListItem } from "./ChatListItem";
import { useChatStore } from "@/store/chat.store";
export const ChatList = () => {
    const chats = useChatStore((state) => state.chats);
    const pathname = useLocation().pathname;
    return (_jsx("div", { children: chats.map((chat) => (_jsx(motion.div, { initial: false, animate: { y: 0 }, children: _jsx(ChatListItem, { chat: chat, active: pathname === `/chat/${chat.id}` }) }, chat.id))) }));
};
