import { motion } from "framer-motion";

interface ContextMenuProps {
  open: boolean;
  x: number;
  y: number;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

export const ContextMenu = ({ open, x, y, onReply, onEdit, onDelete, onCopy }: ContextMenuProps): JSX.Element | null => {
  if (!open) return null;
  return (
    <motion.div className="fixed z-50 w-36 rounded-lg border border-white/10 bg-bg-tertiary p-1" style={{ left: x, top: y }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
      <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover" onClick={onReply}>Reply</button>
      <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover" onClick={onEdit}>Edit</button>
      <button className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-bg-hover" onClick={onCopy}>Copy</button>
      <button className="block w-full rounded px-2 py-1 text-left text-sm text-red-300 hover:bg-bg-hover" onClick={onDelete}>Delete</button>
    </motion.div>
  );
};
