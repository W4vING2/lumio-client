import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Send } from "lucide-react";
import { FilePreview } from "./FilePreview";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useMessageStore } from "@/store/message.store";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
export const MessageInput = ({ chatId }) => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const addMessage = useMessageStore((state) => state.addMessage);
    const applyIncomingMessage = useChatStore((state) => state.applyIncomingMessage);
    const me = useAuthStore((state) => state.user);
    const send = async () => {
        if (!value.trim() && !file)
            return;
        const form = new FormData();
        if (value.trim())
            form.append("content", value.trim());
        if (file)
            form.append("file", file);
        const { data } = await api.post(`/chats/${chatId}/messages`, form, { headers: { "Content-Type": "multipart/form-data" } });
        addMessage(data);
        if (me)
            applyIncomingMessage(data, me.id);
        getSocket()?.emit("typing_stop", { chatId });
        setValue("");
        setFile(null);
    };
    return (_jsxs("div", { className: "relative border-t border-white/10 bg-bg-secondary/80 p-3 backdrop-blur-lg", children: [file ? _jsx(FilePreview, { file: file, onClear: () => setFile(null) }) : null, _jsxs("div", { className: "flex items-end gap-2 rounded-xl border border-white/10 bg-bg-tertiary p-2", children: [_jsx("button", { className: "rounded-lg p-2 hover:bg-bg-hover", onClick: () => fileInputRef.current?.click(), children: _jsx(Paperclip, { size: 18 }) }), _jsx("input", { ref: fileInputRef, type: "file", className: "hidden", onChange: (event) => setFile(event.target.files?.[0] ?? null) }), _jsx("textarea", { value: value, onChange: (event) => {
                            setValue(event.target.value);
                            getSocket()?.emit("typing_start", { chatId });
                        }, onBlur: () => getSocket()?.emit("typing_stop", { chatId }), placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435", rows: 1, className: "max-h-36 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none", onKeyDown: (event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void send();
                            }
                        } }), _jsx(motion.button, { className: "rounded-xl bg-gradient-to-r from-accent to-violet-500 p-3 shadow-glow", whileTap: { scale: 0.92, rotate: 10 }, onClick: () => void send(), children: _jsx(Send, { size: 16 }) })] })] }));
};
