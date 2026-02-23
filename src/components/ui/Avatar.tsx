import { motion } from "framer-motion";
import clsx from "clsx";
import { resolveAssetUrl } from "@/lib/assets";

interface AvatarProps {
  src?: string | null;
  name: string;
  online?: boolean;
  size?: number;
}

export const Avatar = ({ src, name, online, size = 40 }: AvatarProps): JSX.Element => {
  const resolved = resolveAssetUrl(src);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        src={resolved ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`}
        alt={name}
        className="h-full w-full rounded-full object-cover"
      />
      {online ? (
        <motion.span
          className={clsx("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-bg-secondary", "bg-[var(--online)]")}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      ) : null}
    </div>
  );
};
