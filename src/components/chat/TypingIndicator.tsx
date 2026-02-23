import { motion } from "framer-motion";

export const TypingIndicator = ({ names }: { names: string[] }): JSX.Element | null => {
  if (!names.length) return null;
  return (
    <div className="flex items-center gap-2 p-2 text-xs text-text-secondary">
      <span>{names.join(", ")} печатает...</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-accent" animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }} />
        ))}
      </div>
    </div>
  );
};
