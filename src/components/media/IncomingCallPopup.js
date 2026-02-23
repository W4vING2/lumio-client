import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";
export const IncomingCallPopup = ({ open, callerName, onAccept, onDecline }) => {
    if (!open)
        return null;
    return (_jsx(motion.div, { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs(motion.div, { className: "w-full max-w-[420px] rounded-2xl border border-white/10 bg-bg-tertiary p-4", initial: { scale: 0.95, y: 16 }, animate: { scale: 1, y: 0 }, children: [_jsxs("p", { className: "text-center text-sm font-semibold", children: ["\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0439 \u0437\u0432\u043E\u043D\u043E\u043A: ", callerName] }), _jsxs("div", { className: "mt-3 flex flex-col gap-2", children: [_jsxs("button", { className: "flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold", onClick: onAccept, children: [_jsx(Phone, { size: 16 }), "\u041F\u0440\u0438\u043D\u044F\u0442\u044C"] }), _jsxs("button", { className: "flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold", onClick: onDecline, children: [_jsx(PhoneOff, { size: 16 }), "\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C"] })] })] }) }));
};
