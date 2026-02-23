import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps): JSX.Element => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-end bg-black/50 md:place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          className="w-full max-w-lg rounded-t-2xl border border-white/10 bg-bg-tertiary p-4 md:rounded-2xl"
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          exit={{ y: 40 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
