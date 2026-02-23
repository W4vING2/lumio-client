import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";
export const IncomingCallPopup = ({ open, callerName, onAccept, onDecline }) => {
    if (!open)
        return null;
    return (_jsxs(motion.div, { className: "fixed left-1/2 top-4 z-50 w-[calc(100vw-16px)] max-w-[420px] -translate-x-1/2 rounded-xl border border-white/10 bg-bg-tertiary p-3", initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 }, children: [_jsxs("p", { className: "text-sm font-semibold", children: ["\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0437\u0432\u043E\u043D\u043E\u043A: ", callerName] }), _jsxs("div", { className: "mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end", children: [_jsxs("button", { className: "flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold", onClick: onAccept, children: [_jsx(Phone, { size: 16 }), "\u041F\u0440\u0438\u043D\u044F\u0442\u044C"] }), _jsxs("button", { className: "flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold sm:w-auto", onClick: onDecline, children: [_jsx(PhoneOff, { size: 16 }), "\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C"] })] })] }));
};
