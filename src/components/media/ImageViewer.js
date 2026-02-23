import { jsx as _jsx } from "react/jsx-runtime";
import { Modal } from "@/components/ui/Modal";
export const ImageViewer = ({ open, src, onClose }) => (_jsx(Modal, { open: open, onClose: onClose, children: src ? _jsx("img", { src: src, alt: "preview", className: "max-h-[80vh] w-full rounded-xl object-contain" }) : null }));
