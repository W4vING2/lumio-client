import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
export const UserProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        void api.get(`/users/${id}`).then((response) => setUser(response.data));
    }, [id]);
    if (!user) {
        return _jsx("div", { className: "grid h-full place-items-center text-text-secondary", children: "Loading profile..." });
    }
    return (_jsxs("div", { className: "mx-auto max-w-xl p-4 md:p-6", children: [_jsx("button", { className: "mb-3 text-xs text-text-secondary hover:underline md:hidden", onClick: () => navigate("/"), children: "Back to chats" }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-bg-secondary p-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Avatar, { name: user.username, src: user.avatar, online: user.isOnline, size: 72 }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", children: user.displayName ?? user.username }), _jsxs("p", { className: "text-sm text-text-secondary", children: ["@", user.username] }), _jsx("p", { className: "mt-1 text-xs text-text-muted", children: user.isOnline ? "Online" : user.lastSeen ? `Last seen ${new Date(user.lastSeen).toLocaleString()}` : "Offline" })] })] }), _jsx("p", { className: "mt-4 text-sm text-text-secondary", children: user.bio || "No bio yet" }), _jsx("button", { className: "mt-5 rounded-lg bg-accent px-3 py-2 text-sm font-medium", onClick: async () => {
                            const { data } = await api.post("/chats/direct", { userId: user.id });
                            navigate(`/chat/${data.id}`);
                        }, children: "Send message" })] })] }));
};
