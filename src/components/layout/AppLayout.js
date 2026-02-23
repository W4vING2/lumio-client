import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { CallModal } from "@/components/media/CallModal";
import { IncomingCallPopup } from "@/components/media/IncomingCallPopup";
import { useCallStore } from "@/store/call.store";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { useAuthStore } from "@/store/auth.store";
import { getSocket } from "@/lib/socket";
export const AppLayout = () => {
    const location = useLocation();
    const showSidebarMobile = location.pathname === "/";
    const incoming = useCallStore((state) => state.incoming);
    const setCall = useCallStore((state) => state.setCall);
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const fetchMe = useAuthStore((state) => state.fetchMe);
    const fetchedRef = useRef(false);
    useSocketEvents();
    useEffect(() => {
        if (!user && !fetchedRef.current) {
            fetchedRef.current = true;
            void fetchMe();
        }
    }, [user, fetchMe]);
    if (loading) {
        return _jsx("div", { className: "grid h-screen place-items-center text-text-secondary", children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsxs("div", { className: "flex h-screen w-full overflow-hidden", children: [_jsx("div", { className: showSidebarMobile ? "block h-screen w-full md:w-auto" : "hidden h-screen md:block", children: _jsx(Sidebar, {}) }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.main, { className: showSidebarMobile ? "hidden flex-1 md:block" : "flex-1", initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -16 }, transition: { duration: 0.22 }, children: _jsx(Outlet, {}) }, location.pathname) }), _jsx(IncomingCallPopup, { open: incoming, callerName: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C Lumio", onAccept: () => setCall({ open: true, incoming: false }), onDecline: () => {
                    const state = useCallStore.getState();
                    const meState = useAuthStore.getState().user;
                    if (state.chatId && state.peerUserId && meState) {
                        getSocket()?.emit("call_end", { chatId: state.chatId, toUserId: state.peerUserId, reason: "declined" });
                    }
                    setCall({ open: false, incoming: false, signalSdp: null });
                } }), _jsx(CallModal, {})] }));
};
