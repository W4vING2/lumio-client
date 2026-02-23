import { create } from "zustand";
import type { CallType } from "@lumio/shared";

interface CallState {
  open: boolean;
  chatId: string | null;
  peerUserId: string | null;
  type: CallType;
  incoming: boolean;
  signalSdp: RTCSessionDescriptionInit | null;
  setCall: (payload: { open: boolean; chatId?: string; peerUserId?: string; type?: CallType; incoming?: boolean; signalSdp?: RTCSessionDescriptionInit | null }) => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  open: false,
  chatId: null,
  peerUserId: null,
  type: "AUDIO",
  incoming: false,
  signalSdp: null,
  setCall: (payload) =>
    set({
      open: payload.open,
      chatId: payload.chatId ?? get().chatId,
      peerUserId: payload.peerUserId ?? get().peerUserId,
      type: payload.type ?? get().type,
      incoming: payload.incoming ?? false,
      signalSdp: payload.signalSdp !== undefined ? payload.signalSdp : get().signalSdp
    })
}));
