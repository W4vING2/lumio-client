import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
}

export const SearchBar = ({ value, onChange, onFocus, onClear }: SearchBarProps): JSX.Element => (
  <motion.div className="flex items-center gap-2 rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" whileFocus={{ scale: 1.01 }}>
    <Search size={16} className="text-text-secondary" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      placeholder="Search chats or users"
      className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
    />
    {value ? (
      <button className="rounded p-1 text-text-secondary hover:bg-bg-hover" onClick={onClear} type="button">
        <X size={14} />
      </button>
    ) : null}
  </motion.div>
);
