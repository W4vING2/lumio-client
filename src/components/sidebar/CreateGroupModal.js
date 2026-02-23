import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
export const CreateGroupModal = ({ open, users, loading, onClose, onCreate }) => {
    const [name, setName] = useState("");
    const [selected, setSelected] = useState([]);
    const canSubmit = useMemo(() => name.trim().length >= 2 && selected.length > 0, [name, selected.length]);
    return (_jsxs(Modal, { open: open, onClose: onClose, children: [_jsx("h3", { className: "mb-3 text-lg font-semibold", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0440\u0443\u043F\u043F\u0443" }), _jsx("input", { value: name, onChange: (event) => setName(event.target.value), placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u0440\u0443\u043F\u043F\u044B", className: "mb-3 w-full rounded-xl border border-white/10 bg-bg-primary px-3 py-2" }), _jsx("div", { className: "max-h-72 space-y-1 overflow-y-auto", children: users.map((user) => {
                    const isSelected = selected.includes(user.id);
                    return (_jsxs("button", { className: `flex w-full items-center justify-between rounded-lg px-2 py-2 ${isSelected ? "bg-accent/20" : "hover:bg-bg-hover"}`, onClick: () => setSelected((prev) => prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Avatar, { name: user.username, src: user.avatar, online: user.isOnline }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-sm font-medium", children: user.displayName ?? user.username }), _jsxs("p", { className: "text-xs text-text-secondary", children: ["@", user.username] })] })] }), _jsx("span", { className: "text-xs text-text-secondary", children: isSelected ? "Добавлен" : "Добавить" })] }, user.id));
                }) }), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx("button", { className: "rounded-lg border border-white/10 px-3 py-2 text-sm", onClick: onClose, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }), _jsx("button", { className: "rounded-lg bg-accent px-3 py-2 text-sm disabled:opacity-50", disabled: !canSubmit || loading, onClick: async () => {
                            await onCreate({ name: name.trim(), userIds: selected });
                            setName("");
                            setSelected([]);
                        }, children: loading ? "Создание..." : "Создать" })] })] }));
};
