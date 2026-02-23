import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ReplyPreview = ({ text, author }) => (_jsxs("div", { className: "mb-1 rounded-md border-l-2 border-accent bg-black/20 px-2 py-1 text-xs", children: [_jsx("p", { className: "font-semibold text-accent", children: author }), _jsx("p", { className: "truncate text-text-secondary", children: text })] }));
