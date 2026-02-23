export const Skeleton = ({ className }: { className: string }): JSX.Element => (
  <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
);
