import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMessageStore } from "@/store/message.store";
import { useAuthStore } from "@/store/auth.store";
import { MessageBubble } from "./MessageBubble";
import { api } from "@/lib/api";
const EMPTY_MESSAGES = [];
export const MessageList = ({ chatId }) => {
    const parentRef = useRef(null);
    const messages = useMessageStore((state) => state.byChatId[chatId] ?? EMPTY_MESSAGES);
    const loadMessages = useMessageStore((state) => state.loadMessages);
    const addMessage = useMessageStore((state) => state.addMessage);
    const me = useAuthStore((state) => state.user);
    useEffect(() => {
        void loadMessages(chatId);
    }, [chatId, loadMessages]);
    const rows = useMemo(() => [...messages].reverse(), [messages]);
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 82,
        overscan: 10
    });
    return (_jsx("div", { ref: parentRef, className: "h-full overflow-auto px-4", children: _jsx("div", { style: { height: rowVirtualizer.getTotalSize(), width: "100%", position: "relative" }, children: rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const message = rows[virtualRow.index];
                if (!message)
                    return null;
                return (_jsx("div", { style: { position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${virtualRow.start}px)` }, children: _jsx(MessageBubble, { message: message, mine: message.author.id === me?.id, onReact: async (emoji) => {
                            const { data } = await api.post(`/messages/${message.id}/reactions`, { emoji });
                            addMessage(data);
                        } }) }, message.id));
            }) }) }));
};
