import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ChatSummary } from "@lumio/shared";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/auth.store";
import clsx from "clsx";

interface ChatListItemProps {
  chat: ChatSummary;
  active: boolean;
}

export const ChatListItem = ({ chat, active }: ChatListItemProps): JSX.Element => {
  const me = useAuthStore((state) => state.user);
  const peer = chat.members.find((member) => member.id !== me?.id);
  const title = chat.name ?? peer?.displayName ?? peer?.username ?? chat.members[0]?.displayName ?? chat.members[0]?.username ?? "Личный чат";
  const preview = chat.lastMessage?.content?.trim() ? chat.lastMessage.content : chat.lastMessage?.fileName ?? "Нет сообщений";
  const avatarSrc = chat.avatar ?? peer?.avatar ?? null;
  const isOnline = chat.type === "DIRECT" ? Boolean(peer?.isOnline) : chat.members.some((member) => member.id !== me?.id && member.isOnline);
  return (
    <motion.div whileHover={{ y: -1 }} className="mb-2">
      <Link
        to={`/chat/${chat.id}`}
        className={clsx(
          "flex min-h-[72px] items-center gap-3 rounded-xl border p-3 opacity-100 transition",
          active
            ? "border-accent/40 bg-accent/15 backdrop-blur-md"
            : "border-white/10 bg-bg-tertiary/80 hover:border-white/20 hover:bg-bg-hover"
        )}
      >
        <Avatar name={title} src={avatarSrc} online={isOnline} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={clsx("truncate text-sm text-white", chat.unreadCount > 0 ? "font-semibold" : "font-medium")}>{title}</p>
            <span className="text-xs text-text-muted">{chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
          </div>
          <p className="truncate text-xs text-slate-300">{preview}</p>
        </div>
        <Badge value={chat.unreadCount} />
      </Link>
    </motion.div>
  );
};
