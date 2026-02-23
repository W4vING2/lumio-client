import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useRouteError } from "react-router-dom";
export const RouteErrorPage = () => {
    const error = useRouteError();
    return (_jsx("div", { className: "grid h-screen place-items-center p-6", children: _jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-white/10 bg-bg-secondary p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A" }), _jsx("p", { className: "mt-2 text-sm text-text-secondary", children: error?.message ?? "Непредвиденная ошибка приложения" }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Link, { to: "/", className: "rounded-lg bg-accent px-3 py-2 text-sm font-medium", children: "\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E" }), _jsx("button", { className: "rounded-lg border border-white/10 px-3 py-2 text-sm", onClick: () => window.location.reload(), children: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C" })] })] }) }));
};
