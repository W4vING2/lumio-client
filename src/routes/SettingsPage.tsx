import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore, type ThemeMode } from "@/store/theme.store";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";

export const SettingsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const [username, setUsername] = useState(user?.username ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto h-full w-full max-w-2xl overflow-y-auto p-4 pb-24 md:p-6">
      <button className="mb-3 text-xs text-text-secondary hover:underline md:hidden" onClick={() => navigate("/")}>
        Назад к чатам
      </button>
      <h1 className="mb-4 text-2xl font-semibold">Настройки</h1>
      <div className="space-y-3 rounded-2xl border border-white/10 bg-bg-secondary p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.username ?? "Пользователь"} src={user?.avatar} online={user?.isOnline} size={56} />
          <input type="file" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="text-sm" />
        </div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Юзернейм (уникальный)" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Имя" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="О себе" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button className="rounded-lg bg-accent px-3 py-2" onClick={async () => {
          setError(null);
          try {
            const form = new FormData();
            form.append("username", username.trim());
            form.append("displayName", displayName.trim());
            form.append("bio", bio.trim());
            if (avatar) form.append("avatar", avatar);
            await api.patch("/users/me", form, {
              headers: {
                "Content-Type": "multipart/form-data",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
              }
            });
            await fetchMe();
            setAvatar(null);
          } catch (err) {
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Не удалось обновить профиль");
          }
        }}>
          Сохранить профиль
        </button>
        <div className="rounded-xl border border-white/10 bg-bg-tertiary p-3">
          <p className="mb-2 text-sm font-medium">Тема</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {([
              { id: "light", label: "Светлая" },
              { id: "dark", label: "Темная" },
              { id: "green", label: "Зеленая" },
              { id: "blue", label: "Синяя" }
            ] as Array<{ id: ThemeMode; label: string }>).map((theme) => (
              <button
                key={theme.id}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${mode === theme.id ? "border-accent bg-accent/20" : "border-white/10 hover:bg-bg-hover"}`}
                onClick={() => setMode(theme.id)}
                type="button"
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
        <button className="rounded-lg border border-red-400/30 px-3 py-2 text-red-300" onClick={() => void logout()}>Выйти</button>
      </div>
    </div>
  );
};
