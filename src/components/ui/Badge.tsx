import { motion } from "framer-motion";

export const Badge = ({ value }: { value: number }): JSX.Element | null => {
  if (value <= 0) return null;
  return (
    <motion.span
      className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-semibold text-white"
      initial={{ scale: 0.6 }}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 0.4 }}
    >
      {value > 99 ? "99+" : value}
    </motion.span>
  );
};
