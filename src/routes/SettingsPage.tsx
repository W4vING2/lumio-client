import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { api } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";

export const SettingsPage = (): JSX.Element => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);
  const light = useThemeStore((state) => state.light);
  const toggle = useThemeStore((state) => state.toggle);
  const [username, setUsername] = useState(user?.username ?? "");
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6">
      <button className="mb-3 text-xs text-text-secondary hover:underline md:hidden" onClick={() => navigate("/")}>
        Back to chats
      </button>
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <div className="space-y-3 rounded-2xl border border-white/10 bg-bg-secondary p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user?.username ?? "User"} src={user?.avatar} online={user?.isOnline} size={56} />
          <input type="file" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="text-sm" />
        </div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (unique)" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full rounded-xl border border-white/10 bg-bg-tertiary px-3 py-2" />
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
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to update profile");
          }
        }}>
          Save profile
        </button>
        <button className="ml-2 rounded-lg border border-white/10 px-3 py-2" onClick={toggle}>{light ? "Switch to dark" : "Switch to light"}</button>
        <button className="ml-2 rounded-lg border border-red-400/30 px-3 py-2 text-red-300" onClick={() => void logout()}>Logout</button>
      </div>
    </div>
  );
};
