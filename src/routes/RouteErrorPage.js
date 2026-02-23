import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useRouteError } from "react-router-dom";
export const RouteErrorPage = () => {
    const error = useRouteError();
    return (_jsx("div", { className: "grid h-screen place-items-center p-6", children: _jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-white/10 bg-bg-secondary p-6", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Something went wrong" }), _jsx("p", { className: "mt-2 text-sm text-text-secondary", children: error?.message ?? "Unexpected application error" }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Link, { to: "/", className: "rounded-lg bg-accent px-3 py-2 text-sm font-medium", children: "Go home" }), _jsx("button", { className: "rounded-lg border border-white/10 px-3 py-2 text-sm", onClick: () => window.location.reload(), children: "Reload" })] })] }) }));
};
