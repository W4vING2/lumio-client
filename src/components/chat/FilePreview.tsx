export const FilePreview = ({ file, onClear }: { file: File; onClear: () => void }): JSX.Element => (
  <div className="mb-2 flex items-center justify-between rounded-lg border border-white/10 bg-bg-tertiary px-3 py-2 text-sm">
    <span className="truncate">{file.name}</span>
    <button className="text-xs text-red-300" onClick={onClear}>Remove</button>
  </div>
);
