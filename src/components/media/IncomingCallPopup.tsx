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
    <motion.div className="fixed left-1/2 top-4 z-50 w-[320px] -translate-x-1/2 rounded-xl border border-white/10 bg-bg-tertiary p-3" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <p className="text-sm font-semibold">Incoming call from {callerName}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button className="rounded-lg bg-green-500 p-2" onClick={onAccept}><Phone size={16} /></button>
        <button className="rounded-lg bg-red-500 p-2" onClick={onDecline}><PhoneOff size={16} /></button>
      </div>
    </motion.div>
  );
};
