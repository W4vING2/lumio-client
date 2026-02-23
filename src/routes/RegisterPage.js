import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
export const RegisterPage = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const user = useAuthStore((state) => state.user);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState(null);
    if (user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsx("div", { className: "grid h-screen place-items-center p-4", children: _jsxs(motion.form, { className: "w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, onSubmit: async (event) => {
                event.preventDefault();
                setError(null);
                try {
                    const form = new FormData();
                    form.append("username", username);
                    form.append("email", email);
                    form.append("password", password);
                    if (avatar)
                        form.append("avatar", avatar);
                    await register(form);
                    navigate("/");
                }
                catch (err) {
                    const message = err?.response?.data?.message;
                    setError(message ?? "Registration failed");
                }
            }, children: [_jsx("h1", { className: "mb-4 text-2xl font-bold", children: "Create account" }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Username", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("input", { value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("input", { value: password, onChange: (e) => setPassword(e.target.value), type: "password", placeholder: "Password", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("input", { type: "file", onChange: (e) => setAvatar(e.target.files?.[0] ?? null), className: "w-full text-sm" }), error ? _jsx("p", { className: "text-sm text-red-300", children: error }) : null, _jsx("button", { className: "w-full rounded-xl bg-accent px-3 py-2 font-semibold", children: "Register" })] }), _jsxs("p", { className: "mt-3 text-sm text-text-secondary", children: ["Have an account? ", _jsx(Link, { to: "/login", className: "text-accent", children: "Login" })] })] }) }));
};
