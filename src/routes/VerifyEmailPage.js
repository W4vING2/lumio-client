import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
export const VerifyEmailPage = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const setSession = useAuthStore((state) => state.setSession);
    const [code, setCode] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const email = useMemo(() => params.get("email")?.trim().toLowerCase() ?? "", [params]);
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    if (!email)
        return _jsx(Navigate, { to: "/register", replace: true });
    return (_jsx("div", { className: "grid h-screen place-items-center p-4", children: _jsxs(motion.form, { className: "w-full max-w-md rounded-2xl border border-white/10 bg-bg-secondary p-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, onSubmit: async (event) => {
                event.preventDefault();
                setError(null);
                setInfo(null);
                if (code.trim().length !== 6) {
                    setError("Введите 6-значный код");
                    return;
                }
                try {
                    const { data } = await api.post("/auth/verify-email-code", {
                        email,
                        code: code.trim()
                    });
                    setSession(data);
                    navigate("/");
                }
                catch (err) {
                    const message = err.response?.data?.message;
                    setError(message ?? "Не удалось подтвердить email");
                }
            }, children: [_jsx("h1", { className: "mb-2 text-2xl font-bold", children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 email" }), _jsxs("p", { className: "mb-4 text-sm text-text-secondary", children: ["\u041C\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u043A\u043E\u0434 \u043D\u0430 ", email, ". \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0435\u0433\u043E \u043D\u0438\u0436\u0435."] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { value: code, onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6)), placeholder: "6-\u0437\u043D\u0430\u0447\u043D\u044B\u0439 \u043A\u043E\u0434", className: "w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" }), error ? _jsx("p", { className: "text-sm text-red-300", children: error }) : null, info ? _jsx("p", { className: "text-sm text-emerald-300", children: info }) : null, _jsx("button", { className: "w-full rounded-xl bg-accent px-3 py-2 font-semibold", type: "submit", children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C" }), _jsx("button", { className: "w-full rounded-xl border border-white/10 px-3 py-2 font-medium", type: "button", disabled: sending, onClick: async () => {
                                setError(null);
                                setInfo(null);
                                setSending(true);
                                try {
                                    const { data } = await api.post("/auth/send-verification-code", { email });
                                    if (data.debugCode) {
                                        setInfo(`Код отправлен. Тестовый код: ${data.debugCode}`);
                                    }
                                    else {
                                        setInfo("Код отправлен повторно");
                                    }
                                }
                                catch (err) {
                                    const message = err.response?.data?.message;
                                    setError(message ?? "Не удалось отправить код");
                                }
                                finally {
                                    setSending(false);
                                }
                            }, children: sending ? "Отправка..." : "Отправить код еще раз" })] }), _jsxs("p", { className: "mt-3 text-sm text-text-secondary", children: ["\u0412\u0441\u043F\u043E\u043C\u043D\u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C? ", _jsx(Link, { to: "/login", className: "text-accent", children: "\u0412\u043E\u0439\u0442\u0438" })] })] }) }));
};
