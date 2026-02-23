import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
export const UserSearchResults = ({ users, onStartChat }) => {
    if (!users.length)
        return null;
    return (_jsx(motion.div, { className: "mt-2 rounded-xl border border-white/10 bg-bg-tertiary p-2", initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, children: users.map((user) => (_jsxs("div", { className: "mb-1 flex items-center justify-between rounded-lg px-2 py-2 hover:bg-bg-hover", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Avatar, { name: user.username, src: user.avatar, online: user.isOnline }), _jsxs("div", { children: [_jsx(Link, { to: `/profile/${user.id}`, className: "text-sm font-medium hover:underline", children: user.displayName ?? user.username }), _jsxs("p", { className: "text-xs text-text-secondary", children: ["@", user.username] })] })] }), _jsx("button", { className: "rounded-lg bg-accent px-2 py-1 text-xs font-medium", onClick: () => onStartChat(user.id), children: "Start chat" })] }, user.id))) }));
};
