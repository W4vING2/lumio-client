import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ChatListItem } from "./ChatListItem";
import { useChatStore } from "@/store/chat.store";

export const ChatList = (): JSX.Element => {
  const chats = useChatStore((state) => state.chats);
  const pathname = useLocation().pathname;

  return (
    <div>
      {chats.map((chat) => (
        <motion.div key={chat.id} initial={false} animate={{ y: 0 }}>
          <ChatListItem chat={chat} active={pathname === `/chat/${chat.id}`} />
        </motion.div>
      ))}
    </div>
  );
};
