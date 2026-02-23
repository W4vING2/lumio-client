import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { MessageReactions } from "./MessageReactions";
import { resolveAssetUrl } from "@/lib/assets";
const QUICK_REACTIONS = ["👍", "❤️", "😂", "🔥", "👏"];
export const MessageBubble = ({ message, mine, onReact }) => {
    const [showQuickReactions, setShowQuickReactions] = useState(false);
    const holdRef = useRef(null);
    const onHoldStart = () => {
        holdRef.current = window.setTimeout(() => {
            setShowQuickReactions(true);
        }, 380);
    };
    const onHoldEnd = () => {
        if (holdRef.current) {
            window.clearTimeout(holdRef.current);
            holdRef.current = null;
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 14, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, className: clsx("mb-2 flex", mine ? "justify-end" : "justify-start"), children: _jsxs("div", { className: clsx("relative max-w-[75%] rounded-2xl px-3 py-2 text-sm", mine ? "rounded-br-md bg-[var(--sent-bubble)]" : "rounded-bl-md bg-[var(--received-bubble)]"), onMouseDown: onHoldStart, onMouseUp: onHoldEnd, onMouseLeave: onHoldEnd, onTouchStart: onHoldStart, onTouchEnd: onHoldEnd, children: [showQuickReactions ? (_jsx(motion.div, { className: "absolute -top-10 left-0 z-10 flex gap-1 rounded-full border border-white/10 bg-bg-tertiary p-1 shadow-lg", initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, children: QUICK_REACTIONS.map((emoji) => (_jsx("button", { className: "rounded-full px-2 py-1 text-sm hover:bg-bg-hover", onClick: () => {
                            onReact(emoji);
                            setShowQuickReactions(false);
                        }, children: emoji }, emoji))) })) : null, !mine ? (_jsx(Link, { to: `/profile/${message.author.id}`, className: "mb-1 block text-xs font-medium text-accent/90 hover:underline", children: message.author.displayName ?? message.author.username })) : null, _jsx("p", { className: "break-words", children: message.content }), message.fileUrl ? (_jsx("a", { className: "mt-1 block text-xs text-accent underline", href: resolveAssetUrl(message.fileUrl) ?? "#", target: "_blank", rel: "noreferrer", children: message.fileName ?? "attachment" })) : null, _jsxs("div", { className: "mt-1 flex items-center justify-end gap-2 text-[10px] text-white/70", children: [message.isEdited ? _jsx("span", { children: "edited" }) : null, _jsx("span", { children: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })] }), _jsx(MessageReactions, { reactions: message.reactions.map((x) => ({ emoji: x.emoji, count: x.count })) })] }) }));
};
