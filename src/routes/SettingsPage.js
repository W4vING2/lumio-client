import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
export const SettingsPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const fetchMe = useAuthStore((state) => state.fetchMe);
    const logout = useAuthStore((state) => state.logout);
    const light = useThemeStore((state) => state.light);
    const toggle = useThemeStore((state) => state.toggle);
    const [username, setUsername] = useState(user?.username ?? "");
    const [displayName, setDisplayName] = useState(user?.displayName ?? "");
    const [bio, setBio] = useState(user?.bio ?? "");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState(null);
    return (_jsxs("div", { className: "mx-auto max-w-2xl p-4 md:p-6", children: [_jsx("button", { className: "mb-3 text-xs text-text-secondary hover:underline md:hidden", onClick: () => navigate("/"), children: "Back to chats" }), _jsx("h1", { className: "mb-4 text-2xl font-semibold", children: "Settings" }), _jsxs("div", { className: "space-y-3 rounded-2xl border border-white/10 bg-bg-secondary p-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Avatar, { name: user?.username ?? "User", src: user?.avatar, online: user?.isOnline, size: 56 }), _jsx("input", { type: "file", onChange: (event) => setAvatar(event.target.files?.[0] ?? null), className: "text-sm" })] }), _jsx("input", { value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Username (unique)", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Display name", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value), placeholder: "Bio", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), error ? _jsx("p", { className: "text-sm text-red-300", children: error }) : null, _jsx("button", { className: "rounded-lg bg-accent px-3 py-2", onClick: async () => {
                            setError(null);
                            try {
                                const form = new FormData();
                                form.append("username", username.trim());
                                form.append("displayName", displayName.trim());
                                form.append("bio", bio.trim());
                                if (avatar)
                                    form.append("avatar", avatar);
                                await api.patch("/users/me", form, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
                                    }
                                });
                                await fetchMe();
                                setAvatar(null);
                            }
                            catch (err) {
                                setError(err.response?.data?.message ?? "Failed to update profile");
                            }
                        }, children: "Save profile" }), _jsx("button", { className: "ml-2 rounded-lg border border-white/10 px-3 py-2", onClick: toggle, children: light ? "Switch to dark" : "Switch to light" }), _jsx("button", { className: "ml-2 rounded-lg border border-red-400/30 px-3 py-2 text-red-300", onClick: () => void logout(), children: "Logout" })] })] }));
};
