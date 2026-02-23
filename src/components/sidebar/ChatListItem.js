import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth.store";
import clsx from "clsx";
export const ChatListItem = ({ chat, active }) => {
    const me = useAuthStore((state) => state.user);
    const peer = chat.members.find((member) => member.id !== me?.id);
    const title = chat.name ?? peer?.displayName ?? peer?.username ?? chat.members[0]?.displayName ?? chat.members[0]?.username ?? "Direct chat";
    const preview = chat.lastMessage?.content?.trim() ? chat.lastMessage.content : chat.lastMessage?.fileName ?? "No messages yet";
    const avatarSrc = chat.avatar ?? peer?.avatar ?? null;
    return (_jsx(motion.div, { whileHover: { y: -1 }, className: "mb-2", children: _jsxs(Link, { to: `/chat/${chat.id}`, className: clsx("flex min-h-[72px] items-center gap-3 rounded-xl border p-3 opacity-100 transition", active
                ? "border-accent/40 bg-accent/15 backdrop-blur-md"
                : "border-white/10 bg-bg-tertiary/80 hover:border-white/20 hover:bg-bg-hover"), children: [_jsx(Avatar, { name: title, src: avatarSrc, online: chat.members.some((x) => x.isOnline) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("p", { className: clsx("truncate text-sm text-white", chat.unreadCount > 0 ? "font-semibold" : "font-medium"), children: title }), _jsx("span", { className: "text-xs text-text-muted", children: chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })] }), _jsx("p", { className: "truncate text-xs text-slate-300", children: preview })] }), _jsx(Badge, { value: chat.unreadCount })] }) }));
};
