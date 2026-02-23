import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
const EMOJIS = ["😀", "😂", "❤️", "🔥", "👏", "👍", "🎉", "😎", "🥹", "🤝"];
export const EmojiPicker = ({ onSelect }) => (_jsx(motion.div, { className: "grid grid-cols-5 gap-1 rounded-xl border border-white/10 bg-bg-tertiary p-2", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, children: EMOJIS.map((emoji) => (_jsx("button", { className: "rounded p-2 text-lg hover:bg-bg-hover", onClick: () => onSelect(emoji), children: emoji }, emoji))) }));
