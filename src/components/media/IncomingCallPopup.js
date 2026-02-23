import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";
export const IncomingCallPopup = ({ open, callerName, onAccept, onDecline }) => {
    if (!open)
        return null;
    return (_jsxs(motion.div, { className: "fixed left-1/2 top-4 z-50 w-[320px] -translate-x-1/2 rounded-xl border border-white/10 bg-bg-tertiary p-3", initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 }, children: [_jsxs("p", { className: "text-sm font-semibold", children: ["Incoming call from ", callerName] }), _jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [_jsx("button", { className: "rounded-lg bg-green-500 p-2", onClick: onAccept, children: _jsx(Phone, { size: 16 }) }), _jsx("button", { className: "rounded-lg bg-red-500 p-2", onClick: onDecline, children: _jsx(PhoneOff, { size: 16 }) })] })] }));
};
