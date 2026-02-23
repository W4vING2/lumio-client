import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export const TypingIndicator = ({ names }) => {
    if (!names.length)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-2 p-2 text-xs text-text-secondary", children: [_jsxs("span", { children: [names.join(", "), " \u043F\u0435\u0447\u0430\u0442\u0430\u0435\u0442..."] }), _jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => (_jsx(motion.span, { className: "h-1.5 w-1.5 rounded-full bg-accent", animate: { y: [0, -3, 0], opacity: [0.4, 1, 0.4] }, transition: { duration: 0.8, repeat: Infinity, delay: i * 0.12 } }, i))) })] }));
};
