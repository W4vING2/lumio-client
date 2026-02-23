interface MessageReactionsProps {
  reactions: Array<{ emoji: string; count: number }>;
}

export const MessageReactions = ({ reactions }: MessageReactionsProps): JSX.Element | null => (
  reactions.length ? (
  <div className="mt-1 flex flex-wrap items-center gap-1">
    {reactions.map((reaction) => (
      <span key={reaction.emoji} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
        {reaction.emoji} {reaction.count}
      </span>
    ))}
  </div>
) : null
);
