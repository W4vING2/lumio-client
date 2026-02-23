import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/auth.store";
export const GroupProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const me = useAuthStore((state) => state.user);
    const [group, setGroup] = useState(null);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState(null);
    const load = async () => {
        if (!id)
            return;
        const { data } = await api.get(`/chats/${id}`);
        setGroup(data);
        setName(data.name ?? "");
    };
    useEffect(() => {
        void load();
    }, [id]);
    const myRole = useMemo(() => group?.members.find((member) => member.user.id === me?.id)?.role, [group, me?.id]);
    const canManage = myRole === "OWNER" || myRole === "ADMIN";
    if (!group) {
        return _jsx("div", { className: "grid h-full place-items-center text-text-secondary", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0433\u0440\u0443\u043F\u043F\u044B..." });
    }
    return (_jsx("div", { className: "mx-auto h-full w-full max-w-2xl overflow-y-auto p-4 pb-24 md:p-6", children: _jsxs("div", { className: "rounded-2xl border border-white/10 bg-bg-secondary p-4 md:p-6", children: [_jsx("button", { className: "mb-3 text-xs text-text-secondary hover:underline", onClick: () => navigate(`/chat/${group.id}`), children: "\u041D\u0430\u0437\u0430\u0434 \u0432 \u0447\u0430\u0442" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Avatar, { name: group.name ?? "Группа", src: group.avatar, size: 72 }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h1", { className: "truncate text-xl font-semibold", children: group.name ?? "Группа" }), _jsxs("p", { className: "text-sm text-text-secondary", children: [group.members.length, " \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432"] })] })] }), canManage ? (_jsxs("div", { className: "mt-4 space-y-3 rounded-xl border border-white/10 bg-bg-tertiary p-3", children: [_jsx("p", { className: "text-sm font-medium", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0433\u0440\u0443\u043F\u043F\u044B" }), _jsx("input", { value: name, onChange: (event) => setName(event.target.value), placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B", className: "w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm" }), _jsx("input", { type: "file", onChange: (event) => setAvatar(event.target.files?.[0] ?? null), className: "text-sm" }), error ? _jsx("p", { className: "text-sm text-red-300", children: error }) : null, _jsx("button", { className: "rounded-lg bg-accent px-3 py-2 text-sm font-medium", onClick: async () => {
                                setError(null);
                                try {
                                    const form = new FormData();
                                    if (name.trim())
                                        form.append("name", name.trim());
                                    if (avatar)
                                        form.append("avatar", avatar);
                                    await api.patch(`/chats/${group.id}`, form, {
                                        headers: { "Content-Type": "multipart/form-data" }
                                    });
                                    setAvatar(null);
                                    await load();
                                }
                                catch (err) {
                                    setError(err.response?.data?.message ?? "Не удалось обновить группу");
                                }
                            }, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0433\u0440\u0443\u043F\u043F\u044B" })] })) : null, _jsxs("div", { className: "mt-5", children: [_jsx("h2", { className: "mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary", children: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438" }), _jsx("div", { className: "space-y-2", children: group.members.map((member) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-white/10 bg-bg-tertiary px-3 py-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Avatar, { name: member.user.username, src: member.user.avatar, online: member.user.isOnline }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: member.user.displayName ?? member.user.username }), _jsxs("p", { className: "text-xs text-text-secondary", children: ["@", member.user.username, " \u00B7 ", member.role] })] })] }), canManage && member.role !== "OWNER" && member.user.id !== me?.id ? (_jsx("button", { className: "rounded-md border border-red-400/30 px-2 py-1 text-xs text-red-300", onClick: async () => {
                                            try {
                                                await api.delete(`/chats/${group.id}/members/${member.user.id}`);
                                                await load();
                                            }
                                            catch (err) {
                                                setError(err.response?.data?.message ?? "Не удалось удалить участника");
                                            }
                                        }, children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })) : null] }, member.id))) })] })] }) }));
};
