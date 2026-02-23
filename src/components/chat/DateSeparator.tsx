export const DateSeparator = ({ dateLabel }: { dateLabel: string }): JSX.Element => (
  <div className="my-4 flex items-center justify-center">
    <span className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">{dateLabel}</span>
  </div>
);
