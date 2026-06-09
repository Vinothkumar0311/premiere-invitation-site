export function getGuestName(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name") || params.get("to") || "";
  return name.trim().slice(0, 50);
}
