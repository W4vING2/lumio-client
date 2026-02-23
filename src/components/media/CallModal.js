import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useCallStore } from "@/store/call.store";
import { useAuthStore } from "@/store/auth.store";
import { getSocket } from "@/lib/socket";
const ICE_SERVERS = [{ urls: ["stun:stun.l.google.com:19302"] }];
export const CallModal = () => {
    const { open, type, chatId, peerUserId, signalSdp, setCall } = useCallStore();
    const me = useAuthStore((state) => state.user);
    const localRef = useRef(null);
    const remoteRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(type === "AUDIO");
    const [seconds, setSeconds] = useState(0);
    const [error, setError] = useState(null);
    const closeCall = () => {
        localStreamRef.current?.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        pcRef.current?.close();
        pcRef.current = null;
        setCall({ open: false, incoming: false, signalSdp: null });
    };
    useEffect(() => {
        setSeconds(0);
        setError(null);
        if (!open)
            return;
        const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => window.clearInterval(timer);
    }, [open]);
    useEffect(() => {
        if (!open || !chatId || !peerUserId || !me)
            return;
        const socket = getSocket();
        if (!socket)
            return;
        const setup = async () => {
            const isIncomingAnswerFlow = Boolean(signalSdp);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === "VIDEO" });
            localStreamRef.current = stream;
            if (localRef.current)
                localRef.current.srcObject = stream;
            const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
            pcRef.current = pc;
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            pc.ontrack = (event) => {
                const [remoteStream] = event.streams;
                if (remoteRef.current && remoteStream) {
                    remoteRef.current.srcObject = remoteStream;
                }
            };
            pc.onicecandidate = (event) => {
                if (!event.candidate)
                    return;
                socket.emit("ice_candidate", {
                    chatId,
                    fromUserId: me.id,
                    toUserId: peerUserId,
                    candidate: event.candidate.toJSON()
                });
            };
            if (isIncomingAnswerFlow && signalSdp) {
                await pc.setRemoteDescription(new RTCSessionDescription(signalSdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("call_answer", {
                    chatId,
                    fromUserId: me.id,
                    toUserId: peerUserId,
                    sdp: answer,
                    callType: type
                });
            }
            else {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("call_offer", {
                    chatId,
                    fromUserId: me.id,
                    toUserId: peerUserId,
                    sdp: offer,
                    callType: type
                });
            }
        };
        const onAnswer = async (payload) => {
            if (payload.fromUserId !== peerUserId)
                return;
            const pc = pcRef.current;
            if (!pc)
                return;
            await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        };
        const onCandidate = async (payload) => {
            if (payload.fromUserId !== peerUserId)
                return;
            const pc = pcRef.current;
            if (!pc)
                return;
            await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        };
        const onEnd = (payload) => {
            if (payload.fromUserId !== peerUserId)
                return;
            closeCall();
        };
        socket.on("call_answer", onAnswer);
        socket.on("ice_candidate", onCandidate);
        socket.on("call_end", onEnd);
        void setup().catch((err) => {
            const message = err instanceof Error ? err.message : "Failed to initialize media devices";
            setError(message);
        });
        return () => {
            socket.off("call_answer", onAnswer);
            socket.off("ice_candidate", onCandidate);
            socket.off("call_end", onEnd);
            localStreamRef.current?.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            pcRef.current?.close();
            pcRef.current = null;
        };
    }, [open, chatId, peerUserId, me, signalSdp, type, setCall]);
    const duration = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);
    return (_jsx(Modal, { open: open, onClose: closeCall, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative h-64 rounded-xl bg-black/40 p-2", children: [type === "VIDEO" ? (_jsxs(_Fragment, { children: [_jsx("video", { ref: remoteRef, autoPlay: true, playsInline: true, className: "h-full w-full rounded-lg object-cover" }), _jsx("video", { ref: localRef, autoPlay: true, muted: true, playsInline: true, className: "absolute bottom-3 right-3 h-24 w-32 rounded-lg border border-white/20 object-cover" })] })) : (_jsx("div", { className: "grid h-full place-items-center", children: _jsx("p", { children: "Audio call in progress" }) })), _jsx("p", { className: "absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-xs", children: duration })] }), error ? _jsx("p", { className: "rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200", children: error }) : null, _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { className: "rounded-full bg-bg-hover p-3", onClick: () => {
                                const next = !muted;
                                setMuted(next);
                                localStreamRef.current?.getAudioTracks().forEach((track) => {
                                    track.enabled = !next;
                                });
                            }, children: muted ? _jsx(MicOff, { size: 18 }) : _jsx(Mic, { size: 18 }) }), type === "VIDEO" ? (_jsx("button", { className: "rounded-full bg-bg-hover p-3", onClick: () => {
                                const next = !cameraOff;
                                setCameraOff(next);
                                localStreamRef.current?.getVideoTracks().forEach((track) => {
                                    track.enabled = !next;
                                });
                            }, children: cameraOff ? _jsx(VideoOff, { size: 18 }) : _jsx(Video, { size: 18 }) })) : null, _jsx("button", { className: "rounded-full bg-red-500 p-3", onClick: () => {
                                if (chatId && peerUserId) {
                                    getSocket()?.emit("call_end", { chatId, toUserId: peerUserId, reason: "ended" });
                                }
                                closeCall();
                            }, children: _jsx(PhoneOff, { size: 18 }) })] })] }) }));
};
