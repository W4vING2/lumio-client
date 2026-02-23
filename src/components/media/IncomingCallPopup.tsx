import { motion } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";

interface IncomingCallPopupProps {
  open: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallPopup = ({ open, callerName, onAccept, onDecline }: IncomingCallPopupProps): JSX.Element | null => {
  if (!open) return null;
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-bg-tertiary p-4"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
      >
        <p className="text-center text-sm font-semibold">Входящий звонок: {callerName}</p>
        <div className="mt-3 flex flex-col gap-2">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold" onClick={onAccept}>
            <Phone size={16} />
            Принять
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold" onClick={onDecline}>
            <PhoneOff size={16} />
            Отклонить
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
