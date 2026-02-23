export const resolveAssetUrl = (value?: string | null): string | null => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const uploadsIndex = value.indexOf("/uploads/");
  const normalizedValue = uploadsIndex >= 0 ? value.slice(uploadsIndex) : value;

  const base = import.meta.env.VITE_SOCKET_URL as string;
  if (!base) return normalizedValue;

  try {
    return new URL(normalizedValue, base).toString();
  } catch {
    return normalizedValue;
  }
};
