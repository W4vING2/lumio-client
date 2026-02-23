import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { AuthUser } from "@lumio/shared";
import { Avatar } from "@/components/ui/Avatar";

interface CreateGroupModalProps {
  open: boolean;
  users: AuthUser[];
  loading: boolean;
  onClose: () => void;
  onCreate: (payload: { name: string; userIds: string[] }) => Promise<void>;
}

export const CreateGroupModal = ({ open, users, loading, onClose, onCreate }: CreateGroupModalProps): JSX.Element => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const canSubmit = useMemo(() => name.trim().length >= 2 && selected.length > 0, [name, selected.length]);

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-3 text-lg font-semibold">Создать группу</h3>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Название группы"
        className="mb-3 w-full rounded-xl border border-white/10 bg-bg-primary px-3 py-2"
      />
      <div className="max-h-72 space-y-1 overflow-y-auto">
        {users.map((user) => {
          const isSelected = selected.includes(user.id);
          return (
            <button
              key={user.id}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-2 ${isSelected ? "bg-accent/20" : "hover:bg-bg-hover"}`}
              onClick={() =>
                setSelected((prev) =>
                  prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                )
              }
            >
              <div className="flex items-center gap-2">
                <Avatar name={user.username} src={user.avatar} online={user.isOnline} />
                <div className="text-left">
                  <p className="text-sm font-medium">{user.displayName ?? user.username}</p>
                  <p className="text-xs text-text-secondary">@{user.username}</p>
                </div>
              </div>
              <span className="text-xs text-text-secondary">{isSelected ? "Добавлен" : "Добавить"}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-lg border border-white/10 px-3 py-2 text-sm" onClick={onClose}>Отмена</button>
        <button
          className="rounded-lg bg-accent px-3 py-2 text-sm disabled:opacity-50"
          disabled={!canSubmit || loading}
          onClick={async () => {
            await onCreate({ name: name.trim(), userIds: selected });
            setName("");
            setSelected([]);
          }}
        >
          {loading ? "Создание..." : "Создать"}
        </button>
      </div>
    </Modal>
  );
};
