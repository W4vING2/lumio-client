import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Send, Smile } from "lucide-react";
import { FilePreview } from "./FilePreview";
import { EmojiPicker } from "./EmojiPicker";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/store/message.store";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";

export const MessageInput = ({ chatId }: { chatId: string }): JSX.Element => {
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMessage = useMessageStore((state) => state.addMessage);
  const applyIncomingMessage = useChatStore((state) => state.applyIncomingMessage);
  const me = useAuthStore((state) => state.user);

  const send = async (): Promise<void> => {
    if (!value.trim() && !file) return;
    const form = new FormData();
    if (value.trim()) form.append("content", value.trim());
    if (file) form.append("file", file);

    const { data } = await api.post(`/chats/${chatId}/messages`, form, { headers: { "Content-Type": "multipart/form-data" } });
    addMessage(data);
    if (me) applyIncomingMessage(data, me.id);
    getSocket()?.emit("typing_stop", { chatId });
    setValue("");
    setFile(null);
    setShowEmoji(false);
  };

  return (
    <div className="relative border-t border-white/10 bg-bg-secondary/80 p-3 backdrop-blur-lg">
      {file ? <FilePreview file={file} onClear={() => setFile(null)} /> : null}
      {showEmoji ? <div className="absolute bottom-16 left-3"><EmojiPicker onSelect={(emoji) => setValue((prev) => prev + emoji)} /></div> : null}
      <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-bg-tertiary p-2">
        <button className="rounded-lg p-2 hover:bg-bg-hover" onClick={() => setShowEmoji((prev) => !prev)}><Smile size={18} /></button>
        <button className="rounded-lg p-2 hover:bg-bg-hover" onClick={() => fileInputRef.current?.click()}><Paperclip size={18} /></button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            getSocket()?.emit("typing_start", { chatId });
          }}
          onBlur={() => getSocket()?.emit("typing_stop", { chatId })}
          placeholder="Write a message"
          rows={1}
          className="max-h-36 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
        />
        <motion.button className="rounded-xl bg-gradient-to-r from-accent to-violet-500 p-3 shadow-glow" whileTap={{ scale: 0.92, rotate: 10 }} onClick={() => void send()}>
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
};
