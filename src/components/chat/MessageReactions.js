import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export const MessageReactions = ({ reactions }) => (reactions.length ? (_jsx("div", { className: "mt-1 flex flex-wrap items-center gap-1", children: reactions.map((reaction) => (_jsxs("span", { className: "rounded-full bg-white/10 px-2 py-0.5 text-xs", children: [reaction.emoji, " ", reaction.count] }, reaction.emoji))) })) : null);
