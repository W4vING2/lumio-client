import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { ChatList } from "./ChatList";
import { UserSearchResults } from "./UserSearchResults";
import { CreateGroupModal } from "./CreateGroupModal";
import { Avatar } from "@/components/ui/Avatar";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import type { AuthUser } from "@lumio/shared";

export const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();
  const loadChats = useChatStore((state) => state.loadChats);
  const me = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AuthUser[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [savingGroup, setSavingGroup] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setSearchOpen(true);

    const id = setTimeout(async () => {
      const { data } = await api.get<AuthUser[]>("/users/search", { params: { q: query } });
      setResults(data);
    }, 220);

    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!showGroupModal) return;
    void api.get<AuthUser[]>("/users/search").then((response) => {
      setResults(response.data);
    });
  }, [showGroupModal]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent): void => {
      if (!searchWrapRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  const topName = useMemo(() => me?.displayName ?? me?.username ?? "Lumio", [me]);

  return (
    <aside className="h-screen w-full border-r border-white/10 bg-bg-secondary p-4 md:w-80">
      <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-accent/30 to-transparent p-3">
        <button className="flex items-center gap-2 font-semibold hover:underline" onClick={() => navigate("/settings")}>
          <Avatar name={topName} src={me?.avatar} online={me?.isOnline} size={28} />
          <span className="truncate">{topName}</span>
        </button>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 hover:bg-white/10" onClick={() => setShowGroupModal(true)}>
            <Plus size={16} />
          </button>
          <button className="rounded-lg p-2 hover:bg-white/10" onClick={() => navigate("/settings")}>
            <Settings size={16} />
          </button>
        </div>
      </div>
      <div ref={searchWrapRef}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onFocus={() => setSearchOpen(true)}
          onClear={() => {
            setQuery("");
            setResults([]);
            setSearchOpen(false);
          }}
        />
        {searchOpen ? (
          <UserSearchResults
            users={results}
            onStartChat={async (userId) => {
              const { data } = await api.post<{ id: string }>("/chats/direct", { userId });
              navigate(`/chat/${data.id}`);
              setQuery("");
              setResults([]);
              setSearchOpen(false);
            }}
          />
        ) : null}
      </div>
      <div className="mt-4 max-h-[calc(100vh-190px)] overflow-y-auto pr-1">
        <ChatList />
      </div>
      <CreateGroupModal
        open={showGroupModal}
        users={results}
        loading={savingGroup}
        onClose={() => setShowGroupModal(false)}
        onCreate={async ({ name, userIds }) => {
          setSavingGroup(true);
          try {
            const { data } = await api.post<{ id: string }>("/chats/group", {
              name,
              memberIds: userIds.join(",")
            });
            await loadChats();
            setShowGroupModal(false);
            navigate(`/chat/${data.id}`);
          } finally {
            setSavingGroup(false);
          }
        }}
      />
    </aside>
  );
};
