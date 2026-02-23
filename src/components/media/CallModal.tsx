import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useCallStore } from "@/store/call.store";
import { useAuthStore } from "@/store/auth.store";
import { getSocket } from "@/lib/socket";

const parseIceServers = (): RTCIceServer[] => {
  const raw = import.meta.env.VITE_ICE_SERVERS as string | undefined;
  if (!raw) return [{ urls: ["stun:stun.l.google.com:19302"] }];
  try {
    const parsed = JSON.parse(raw) as RTCIceServer[];
    return Array.isArray(parsed) && parsed.length ? parsed : [{ urls: ["stun:stun.l.google.com:19302"] }];
  } catch {
    return [{ urls: ["stun:stun.l.google.com:19302"] }];
  }
};

const ICE_SERVERS: RTCIceServer[] = parseIceServers();

export const CallModal = (): JSX.Element => {
  const { open, type, chatId, peerUserId, signalSdp, setCall } = useCallStore();
  const me = useAuthStore((state) => state.user);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(type === "AUDIO");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCameraOff(type === "AUDIO");
  }, [type]);

  const closeCall = (): void => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    setCall({ open: false, incoming: false, signalSdp: null });
  };

  useEffect(() => {
    setSeconds(0);
    setError(null);
    if (!open) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !chatId || !peerUserId || !me) return;

    const socket = getSocket();
    if (!socket) return;

    const setup = async (): Promise<void> => {
      const isIncomingAnswerFlow = Boolean(signalSdp);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === "VIDEO" });
      localStreamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      remoteStreamRef.current = new MediaStream();
      if (remoteRef.current) remoteRef.current.srcObject = remoteStreamRef.current;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStreamRef.current;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        const first = event.streams[0];
        const remoteStream = remoteStreamRef.current;
        if (first) {
          if (remoteRef.current) remoteRef.current.srcObject = first;
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = first;
          return;
        }
        if (!remoteStream) return;
        remoteStream.addTrack(event.track);
        if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
      };

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
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
      } else {
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

    const onAnswer = async (payload: { fromUserId: string; sdp: RTCSessionDescriptionInit }): Promise<void> => {
      if (payload.fromUserId !== peerUserId) return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    };

    const onCandidate = async (payload: { fromUserId: string; candidate: RTCIceCandidateInit }): Promise<void> => {
      if (payload.fromUserId !== peerUserId) return;
      const pc = pcRef.current;
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    };

    const onEnd = (payload: { fromUserId: string }): void => {
      if (payload.fromUserId !== peerUserId) return;
      closeCall();
    };

    socket.on("call_answer", onAnswer);
    socket.on("ice_candidate", onCandidate);
    socket.on("call_end", onEnd);

    void setup().catch((err: unknown) => {
      const message =
        err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "SecurityError")
          ? "Нет доступа к микрофону/камере. Разрешите доступ в браузере."
          : err instanceof DOMException && (err.name === "NotFoundError" || err.name === "DevicesNotFoundError")
            ? "Микрофон или камера не найдены на устройстве."
            : err instanceof Error
              ? err.message
              : "Не удалось инициализировать медиа-устройства";
      setError(message);
    });

    return () => {
      socket.off("call_answer", onAnswer);
      socket.off("ice_candidate", onCandidate);
      socket.off("call_end", onEnd);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, [open, chatId, peerUserId, me, signalSdp, type, setCall]);

  const duration = useMemo(
    () => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
    [seconds]
  );

  return (
    <Modal open={open} onClose={closeCall}>
      <div className="space-y-4">
        <div className="relative h-64 rounded-xl bg-black/40 p-2">
          <audio ref={remoteAudioRef} autoPlay playsInline />
          {type === "VIDEO" ? (
            <>
              <video ref={remoteRef} autoPlay playsInline className="h-full w-full rounded-lg object-cover" />
              <video ref={localRef} autoPlay muted playsInline className="absolute bottom-3 right-3 h-24 w-32 rounded-lg border border-white/20 object-cover" />
            </>
          ) : (
            <div className="grid h-full place-items-center">
              <p>Идет аудиозвонок</p>
            </div>
          )}
          <p className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-1 text-xs">{duration}</p>
        </div>
        {error ? <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p> : null}
        <div className="flex justify-center gap-3">
          <button
            className="rounded-full bg-bg-hover p-3"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              localStreamRef.current?.getAudioTracks().forEach((track) => {
                track.enabled = !next;
              });
            }}
          >
            {muted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          {type === "VIDEO" ? (
            <button
              className="rounded-full bg-bg-hover p-3"
              onClick={() => {
                const next = !cameraOff;
                setCameraOff(next);
                localStreamRef.current?.getVideoTracks().forEach((track) => {
                  track.enabled = !next;
                });
              }}
            >
              {cameraOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
          ) : null}
          <button
            className="rounded-full bg-red-500 p-3"
            onClick={() => {
              if (chatId && peerUserId) {
                getSocket()?.emit("call_end", { chatId, toUserId: peerUserId, reason: "ended" });
              }
              closeCall();
            }}
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
