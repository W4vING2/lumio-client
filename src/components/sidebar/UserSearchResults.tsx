import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { AuthUser } from "@lumio/shared";
import { Avatar } from "@/components/ui/Avatar";

interface UserSearchResultsProps {
  users: AuthUser[];
  onStartChat: (userId: string) => void;
}

export const UserSearchResults = ({ users, onStartChat }: UserSearchResultsProps): JSX.Element | null => {
  if (!users.length) return null;
  return (
    <motion.div className="mt-2 rounded-xl border border-white/10 bg-bg-tertiary p-2" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
      {users.map((user) => (
        <div className="mb-1 flex items-center justify-between rounded-lg px-2 py-2 hover:bg-bg-hover" key={user.id}>
          <div className="flex items-center gap-2">
            <Avatar name={user.username} src={user.avatar} online={user.isOnline} />
            <div>
              <Link to={`/profile/${user.id}`} className="text-sm font-medium hover:underline">{user.displayName ?? user.username}</Link>
              <p className="text-xs text-text-secondary">@{user.username}</p>
            </div>
          </div>
          <button className="rounded-lg bg-accent px-2 py-1 text-xs font-medium" onClick={() => onStartChat(user.id)}>
            Начать чат
          </button>
        </div>
      ))}
    </motion.div>
  );
};
