import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@lumio/shared";

type GroupMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: AuthUser;
};

type GroupPayload = {
  id: string;
  type: "GROUP" | "DIRECT" | "CHANNEL";
  name: string | null;
  avatar: string | null;
  members: GroupMember[];
};

export const GroupProfilePage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const me = useAuthStore((state) => state.user);
  const [group, setGroup] = useState<GroupPayload | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    if (!id) return;
    const { data } = await api.get<GroupPayload>(`/chats/${id}`);
    setGroup(data);
    setName(data.name ?? "");
  };

  useEffect(() => {
    void load();
  }, [id]);

  const myRole = useMemo(() => group?.members.find((member) => member.user.id === me?.id)?.role, [group, me?.id]);
  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  if (!group) {
    return <div className="grid h-full place-items-center text-text-secondary">Loading group...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <div className="rounded-2xl border border-white/10 bg-bg-secondary p-4 md:p-6">
        <button className="mb-3 text-xs text-text-secondary hover:underline" onClick={() => navigate(`/chat/${group.id}`)}>
          Back to chat
        </button>
        <div className="flex items-center gap-4">
          <Avatar name={group.name ?? "Group"} src={group.avatar} size={72} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold">{group.name ?? "Group"}</h1>
            <p className="text-sm text-text-secondary">{group.members.length} members</p>
          </div>
        </div>

        {canManage ? (
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-bg-tertiary p-3">
            <p className="text-sm font-medium">Group settings</p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Group name"
              className="w-full rounded-lg border border-white/10 bg-bg-primary px-3 py-2 text-sm"
            />
            <input type="file" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="text-sm" />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <button
              className="rounded-lg bg-accent px-3 py-2 text-sm font-medium"
              onClick={async () => {
                setError(null);
                try {
                  const form = new FormData();
                  if (name.trim()) form.append("name", name.trim());
                  if (avatar) form.append("avatar", avatar);
                  await api.patch(`/chats/${group.id}`, form, {
                    headers: { "Content-Type": "multipart/form-data" }
                  });
                  setAvatar(null);
                  await load();
                } catch (err) {
                  setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to update group");
                }
              }}
            >
              Save group profile
            </button>
          </div>
        ) : null}

        <div className="mt-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">Members</h2>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-bg-tertiary px-3 py-2">
                <div className="flex items-center gap-2">
                  <Avatar name={member.user.username} src={member.user.avatar} online={member.user.isOnline} />
                  <div>
                    <p className="text-sm font-medium">{member.user.displayName ?? member.user.username}</p>
                    <p className="text-xs text-text-secondary">@{member.user.username} · {member.role}</p>
                  </div>
                </div>
                {canManage && member.role !== "OWNER" && member.user.id !== me?.id ? (
                  <button
                    className="rounded-md border border-red-400/30 px-2 py-1 text-xs text-red-300"
                    onClick={async () => {
                      try {
                        await api.delete(`/chats/${group.id}/members/${member.user.id}`);
                        await load();
                      } catch (err) {
                        setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to remove member");
                      }
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
