import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AuthUser } from "@lumio/shared";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";

export const UserProfilePage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!id) return;
    void api.get<AuthUser>(`/users/${id}`).then((response) => setUser(response.data));
  }, [id]);

  if (!user) {
    return <div className="grid h-full place-items-center text-text-secondary">Загрузка профиля...</div>;
  }

  return (
    <div className="mx-auto h-full w-full max-w-xl overflow-y-auto p-4 pb-24 md:p-6">
      <button className="mb-3 text-xs text-text-secondary hover:underline md:hidden" onClick={() => navigate("/")}>
        Назад к чатам
      </button>
      <div className="rounded-2xl border border-white/10 bg-bg-secondary p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.username} src={user.avatar} online={user.isOnline} size={72} />
          <div>
            <h1 className="text-xl font-semibold">{user.displayName ?? user.username}</h1>
            <p className="text-sm text-text-secondary">@{user.username}</p>
            <p className="mt-1 text-xs text-text-muted">{user.isOnline ? "В сети" : user.lastSeen ? `Был(а) в сети ${new Date(user.lastSeen).toLocaleString()}` : "Не в сети"}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-text-secondary">{user.bio || "Пока без описания"}</p>
        <button
          className="mt-5 rounded-lg bg-accent px-3 py-2 text-sm font-medium"
          onClick={async () => {
            const { data } = await api.post<{ id: string }>("/chats/direct", { userId: user.id });
            navigate(`/chat/${data.id}`);
          }}
        >
          Написать
        </button>
      </div>
    </div>
  );
};
