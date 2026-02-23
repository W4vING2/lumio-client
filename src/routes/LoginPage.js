import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const user = useAuthStore((state) => state.user);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    if (user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsx("div", { className: "grid h-screen place-items-center p-4", children: _jsxs(motion.form, { className: "w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, onSubmit: async (event) => { event.preventDefault(); await login(email, password); navigate("/"); }, children: [_jsx("h1", { className: "mb-4 text-2xl font-bold", children: "\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C" }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("input", { value: password, onChange: (e) => setPassword(e.target.value), type: "password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), _jsx("button", { className: "w-full rounded-xl bg-accent px-3 py-2 font-semibold", children: "\u0412\u043E\u0439\u0442\u0438" })] }), _jsxs("p", { className: "mt-3 text-sm text-text-secondary", children: ["\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? ", _jsx(Link, { to: "/register", className: "text-accent", children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" })] })] }) }));
};
