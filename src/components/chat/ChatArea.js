import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, User, UserPlus, Video } from "lucide-react";
import { useMessageStore } from "@/store/message.store";
import { useCallStore } from "@/store/call.store";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
const EMPTY_TYPING = [];
const EMPTY_MEMBERS = [];
export const ChatArea = ({ chatId }) => {
    const navigate = useNavigate();
    const typing = useMessageStore((state) => state.typingUsers[chatId] ?? EMPTY_TYPING);
    const setCall = useCallStore((state) => state.setCall);
    const me = useAuthStore((state) => state.user);
    const [chatName, setChatName] = useState("Чат");
    const [chatType, setChatType] = useState("DIRECT");
    const [members, setMembers] = useState(EMPTY_MEMBERS);
    const [addOpen, setAddOpen] = useState(false);
    const [candidates, setCandidates] = useState(EMPTY_MEMBERS);
    const [selectedIds, setSelectedIds] = useState([]);
    const requestCallPermissions = async (callType) => {
        if (!navigator.mediaDevices?.getUserMedia) {
            window.alert("Медиа-устройства недоступны. Открой приложение через HTTPS.");
            return false;
        }
        try {
            const probe = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: callType === "VIDEO"
            });
            probe.getTracks().forEach((track) => track.stop());
            return true;
        }
        catch {
            window.alert(callType === "VIDEO"
                ? "Нужен доступ к микрофону и камере. Разрешите доступ в настройках браузера."
                : "Нужен доступ к микрофону. Разрешите доступ в настройках браузера.");
            return false;
        }
    };
    useEffect(() => {
        void api.get(`/chats/${chatId}`).then(({ data }) => {
            setChatName(data.name ?? "Личный чат");
            setChatType(data.type);
            setMembers(data.members.map((member) => member.user));
        });
    }, [chatId]);
    const peerProfile = useMemo(() => {
        return members.find((member) => member.id !== me?.id) ?? null;
    }, [members, me?.id]);
    return (_jsxs("section", { className: "flex h-full flex-1 flex-col bg-bg-primary", children: [_jsxs("header", { className: "flex items-center justify-between border-b border-white/10 px-3 py-3 md:px-4", children: [_jsx("button", { className: "mr-2 rounded-lg border border-white/10 p-1.5 md:hidden", onClick: () => navigate("/"), children: _jsx(ChevronLeft, { size: 16 }) }), chatType === "DIRECT" && peerProfile ? (_jsx(Link, { to: `/profile/${peerProfile.id}`, className: "truncate text-sm font-semibold hover:underline", children: peerProfile.displayName ?? peerProfile.username })) : chatType === "GROUP" ? (_jsx(Link, { to: `/group/${chatId}`, className: "truncate text-sm font-semibold hover:underline", children: chatName })) : (_jsx("h2", { className: "truncate text-sm font-semibold", children: chatName })), _jsxs("div", { className: "ml-2 flex gap-1 md:gap-2", children: [chatType === "DIRECT" && peerProfile ? (_jsx(Link, { to: `/profile/${peerProfile.id}`, className: "rounded-lg border border-white/10 p-2 hover:bg-bg-hover md:hidden", "aria-label": "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F", children: _jsx(User, { size: 16 }) })) : null, chatType === "GROUP" ? (_jsx("button", { className: "rounded-lg border border-white/10 p-2 hover:bg-bg-hover", onClick: async () => {
                                    const { data } = await api.get("/users/search");
                                    const inGroup = new Set(members.map((member) => member.id));
                                    setCandidates(data.filter((user) => !inGroup.has(user.id)));
                                    setAddOpen(true);
                                }, children: _jsx(UserPlus, { size: 16 }) })) : null, _jsx("button", { className: "rounded-lg border border-white/10 p-2 hover:bg-bg-hover disabled:opacity-40", disabled: chatType === "DIRECT" && !peerProfile, onClick: async () => {
                                    const ok = await requestCallPermissions("AUDIO");
                                    if (!ok)
                                        return;
                                    setCall({ open: true, chatId, type: "AUDIO", peerUserId: peerProfile?.id, incoming: false, signalSdp: null });
                                }, children: _jsx(Phone, { size: 16 }) }), _jsx("button", { className: "rounded-lg border border-white/10 p-2 hover:bg-bg-hover disabled:opacity-40", disabled: chatType === "DIRECT" && !peerProfile, onClick: async () => {
                                    const ok = await requestCallPermissions("VIDEO");
                                    if (!ok)
                                        return;
                                    setCall({ open: true, chatId, type: "VIDEO", peerUserId: peerProfile?.id, incoming: false, signalSdp: null });
                                }, children: _jsx(Video, { size: 16 }) })] })] }), _jsx(TypingIndicator, { names: typing }), _jsx("div", { className: "min-h-0 flex-1", children: _jsx(MessageList, { chatId: chatId }) }), _jsx(MessageInput, { chatId: chatId }), _jsxs(Modal, { open: addOpen, onClose: () => setAddOpen(false), children: [_jsx("h3", { className: "mb-3 text-lg font-semibold", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432" }), _jsx("div", { className: "max-h-72 space-y-1 overflow-y-auto", children: candidates.map((user) => {
                            const selected = selectedIds.includes(user.id);
                            return (_jsxs("button", { className: `flex w-full items-center justify-between rounded-lg px-3 py-2 ${selected ? "bg-accent/20" : "hover:bg-bg-hover"}`, onClick: () => setSelectedIds((prev) => prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]), children: [_jsx("span", { children: user.displayName ?? user.username }), _jsx("span", { className: "text-xs", children: selected ? "Добавлен" : "Добавить" })] }, user.id));
                        }) }), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx("button", { className: "rounded-lg border border-white/10 px-3 py-2 text-sm", onClick: () => setAddOpen(false), children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { className: "rounded-lg bg-accent px-3 py-2 text-sm", onClick: async () => {
                                    if (!selectedIds.length)
                                        return;
                                    await api.post(`/chats/${chatId}/members`, { userIds: selectedIds });
                                    const { data } = await api.get(`/chats/${chatId}`);
                                    setMembers(data.members.map((member) => member.user));
                                    setSelectedIds([]);
                                    setAddOpen(false);
                                }, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] })] })] }));
};
