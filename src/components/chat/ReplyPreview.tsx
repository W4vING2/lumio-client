export const ReplyPreview = ({ text, author }: { text: string; author: string }): JSX.Element => (
  <div className="mb-1 rounded-md border-l-2 border-accent bg-black/20 px-2 py-1 text-xs">
    <p className="font-semibold text-accent">{author}</p>
    <p className="truncate text-text-secondary">{text}</p>
  </div>
);
