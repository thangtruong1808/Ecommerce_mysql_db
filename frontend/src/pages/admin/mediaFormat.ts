export function mediaUrl(url: string | null | undefined): string {
  if (!url) {
    return "";
  }
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${window.location.origin}${url}`;
}

export function durationLabel(value: unknown): string {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "N/A";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function durationValue(raw: FormDataEntryValue | null): number | null {
  const text = String(raw || "").trim();
  if (!text) {
    return null;
  }
  const amount = Number(text);
  return Number.isFinite(amount) ? amount : null;
}
