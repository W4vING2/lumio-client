import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export const Tooltip = ({ text, show }) => (_jsx(motion.div, { className: "pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-bg-tertiary px-2 py-1 text-xs text-text-secondary", initial: false, animate: { opacity: show ? 1 : 0, y: show ? 0 : 6 }, children: text }));
