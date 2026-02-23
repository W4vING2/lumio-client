import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, UserPlus, Video } from "lucide-react";
import { useMessageStore } from "@/store/message.store";
import { useCallStore } from "@/store/call.store";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import type { AuthUser } from "@lumio/shared";

const EMPTY_TYPING: string[] = [];
const EMPTY_MEMBERS: AuthUser[] = [];

export const ChatArea = ({ chatId }: { chatId: string }): JSX.Element => {
  const navigate = useNavigate();
  const typing = useMessageStore((state) => state.typingUsers[chatId] ?? EMPTY_TYPING);
  const setCall = useCallStore((state) => state.setCall);
  const me = useAuthStore((state) => state.user);
  const [chatName, setChatName] = useState("Chat");
  const [chatType, setChatType] = useState<"DIRECT" | "GROUP" | "CHANNEL">("DIRECT");
  const [members, setMembers] = useState<AuthUser[]>(EMPTY_MEMBERS);
  const [addOpen, setAddOpen] = useState(false);
  const [candidates, setCandidates] = useState<AuthUser[]>(EMPTY_MEMBERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const requestCallPermissions = async (callType: "AUDIO" | "VIDEO"): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      window.alert("Media devices are unavailable in this browser context. Use https or localhost.");
      return false;
    }
    try {
      if (navigator.permissions?.query) {
        const micStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName
        });
        if (micStatus.state === "denied") {
          window.alert("Lumio needs access to microphone. Please allow access in your browser settings.");
          return false;
        }

        if (callType === "VIDEO") {
          const camStatus = await navigator.permissions.query({
            name: "camera" as PermissionName
          });
          if (camStatus.state === "denied") {
            window.alert("Lumio needs access to camera. Please allow access in your browser settings.");
            return false;
          }
        }
      }
      return true;
    } catch {
      // If permission API is unavailable or throws, do not block call start.
      return true;
    }
  };

  useEffect(() => {
    void api.get(`/chats/${chatId}`).then(({ data }) => {
      setChatName(data.name ?? "Direct chat");
      setChatType(data.type);
      setMembers(data.members.map((member: { user: AuthUser }) => member.user));
    });
  }, [chatId]);

  const peerProfile = useMemo(() => {
    return members.find((member) => member.id !== me?.id) ?? null;
  }, [members, me?.id]);

  return (
    <section className="flex h-full flex-1 flex-col bg-bg-primary">
      <header className="flex items-center justify-between border-b border-white/10 px-3 py-3 md:px-4">
        <button className="mr-2 rounded-lg border border-white/10 p-1.5 md:hidden" onClick={() => navigate("/")}>
          <ChevronLeft size={16} />
        </button>
        {chatType === "DIRECT" && peerProfile ? (
          <Link to={`/profile/${peerProfile.id}`} className="truncate text-sm font-semibold hover:underline">
            {peerProfile.displayName ?? peerProfile.username}
          </Link>
        ) : chatType === "GROUP" ? (
          <Link to={`/group/${chatId}`} className="truncate text-sm font-semibold hover:underline">
            {chatName}
          </Link>
        ) : (
          <h2 className="truncate text-sm font-semibold">{chatName}</h2>
        )}
        <div className="ml-2 flex gap-1 md:gap-2">
          {chatType === "GROUP" ? (
            <button
              className="rounded-lg border border-white/10 p-2 hover:bg-bg-hover"
              onClick={async () => {
                const { data } = await api.get<AuthUser[]>("/users/search");
                const inGroup = new Set(members.map((member) => member.id));
                setCandidates(data.filter((user) => !inGroup.has(user.id)));
                setAddOpen(true);
              }}
            >
              <UserPlus size={16} />
            </button>
          ) : null}
          <button
            className="rounded-lg border border-white/10 p-2 hover:bg-bg-hover disabled:opacity-40"
            disabled={chatType === "DIRECT" && !peerProfile}
            onClick={async () => {
              const ok = await requestCallPermissions("AUDIO");
              if (!ok) return;
              setCall({ open: true, chatId, type: "AUDIO", peerUserId: peerProfile?.id, incoming: false, signalSdp: null });
            }}
          >
            <Phone size={16} />
          </button>
          <button
            className="rounded-lg border border-white/10 p-2 hover:bg-bg-hover disabled:opacity-40"
            disabled={chatType === "DIRECT" && !peerProfile}
            onClick={async () => {
              const ok = await requestCallPermissions("VIDEO");
              if (!ok) return;
              setCall({ open: true, chatId, type: "VIDEO", peerUserId: peerProfile?.id, incoming: false, signalSdp: null });
            }}
          >
            <Video size={16} />
          </button>
        </div>
      </header>
      <TypingIndicator names={typing} />
      <div className="min-h-0 flex-1">
        <MessageList chatId={chatId} />
      </div>
      <MessageInput chatId={chatId} />
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <h3 className="mb-3 text-lg font-semibold">Add members</h3>
        <div className="max-h-72 space-y-1 overflow-y-auto">
          {candidates.map((user) => {
            const selected = selectedIds.includes(user.id);
            return (
              <button
                key={user.id}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${selected ? "bg-accent/20" : "hover:bg-bg-hover"}`}
                onClick={() =>
                  setSelectedIds((prev) =>
                    prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                  )
                }
              >
                <span>{user.displayName ?? user.username}</span>
                <span className="text-xs">{selected ? "Added" : "Add"}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-lg border border-white/10 px-3 py-2 text-sm" onClick={() => setAddOpen(false)}>Cancel</button>
          <button
            className="rounded-lg bg-accent px-3 py-2 text-sm"
            onClick={async () => {
              if (!selectedIds.length) return;
              await api.post(`/chats/${chatId}/members`, { userIds: selectedIds });
              const { data } = await api.get(`/chats/${chatId}`);
              setMembers(data.members.map((member: { user: AuthUser }) => member.user));
              setSelectedIds([]);
              setAddOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </Modal>
    </section>
  );
};
