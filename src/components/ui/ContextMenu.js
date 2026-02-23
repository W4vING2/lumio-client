import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
export const ContextMenu = ({ open, x, y, onReply, onEdit, onDelete, onCopy }) => {
    if (!open)
        return null;
    return (_jsxs(motion.div, { className: "fixed z-50 w-36 rounded-lg border border-white/10 bg-bg-tertiary p-1", style: { left: x, top: y }, initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, children: [_jsx("button", { className: "block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover", onClick: onReply, children: "Reply" }), _jsx("button", { className: "block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover", onClick: onEdit, children: "Edit" }), _jsx("button", { className: "block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover", onClick: onCopy, children: "Copy" }), _jsx("button", { className: "block w-full rounded px-2 py-1 text-left text-sm text-red-300 hover:bg-bg-hover", onClick: onDelete, children: "Delete" })] }));
};
