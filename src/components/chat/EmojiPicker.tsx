import { motion } from "framer-motion";

const EMOJIS = ["😀", "😂", "❤️", "🔥", "👏", "👍", "🎉", "😎", "🥹", "🤝"];

export const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }): JSX.Element => (
  <motion.div className="grid grid-cols-5 gap-1 rounded-xl border border-white/10 bg-bg-tertiary p-2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
    {EMOJIS.map((emoji) => (
      <button key={emoji} className="rounded p-2 text-lg hover:bg-bg-hover" onClick={() => onSelect(emoji)}>
        {emoji}
      </button>
    ))}
  </motion.div>
);
