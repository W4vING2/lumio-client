import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import clsx from "clsx";
import { resolveAssetUrl } from "@/lib/assets";
export const Avatar = ({ src, name, online, size = 40 }) => {
    const resolved = resolveAssetUrl(src);
    return (_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsx("img", { src: resolved ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`, alt: name, className: "h-full w-full rounded-full object-cover" }), online ? (_jsx(motion.span, { className: clsx("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg-secondary", "bg-[var(--online)]"), animate: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }, transition: { duration: 1.8, repeat: Infinity } })) : null] }));
};
