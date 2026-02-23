import { create } from "zustand";
export const useCallStore = create((set, get) => ({
    open: false,
    chatId: null,
    peerUserId: null,
    type: "AUDIO",
    incoming: false,
    signalSdp: null,
    setCall: (payload) => set({
        open: payload.open,
        chatId: payload.chatId ?? get().chatId,
        peerUserId: payload.peerUserId ?? get().peerUserId,
        type: payload.type ?? get().type,
        incoming: payload.incoming ?? false,
        signalSdp: payload.signalSdp !== undefined ? payload.signalSdp : get().signalSdp
    })
}));
