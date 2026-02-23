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
      className="fixed left-1/2 top-4 z-50 w-[calc(100vw-16px)] max-w-[420px] -translate-x-1/2 rounded-xl border border-white/10 bg-bg-tertiary p-3"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <p className="text-sm font-semibold">Входящий звонок: {callerName}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold" onClick={onAccept}>
          <Phone size={16} />
          Принять
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold sm:w-auto" onClick={onDecline}>
          <PhoneOff size={16} />
          Отклонить
        </button>
      </div>
    </motion.div>
  );
};
