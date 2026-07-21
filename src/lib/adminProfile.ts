/** Damian Lillard's official ESPN headshot — the default dashboard avatar. */
export const DEFAULT_AVATAR_URL = "https://a.espncdn.com/i/headshots/nba/players/full/6606.png";

const AVATAR_KEY = "dt-dashboard-avatar";
const AVATAR_EVENT = "dt-avatar-changed";

export function getDashboardAvatar(): string {
  try {
    return localStorage.getItem(AVATAR_KEY)?.trim() || DEFAULT_AVATAR_URL;
  } catch {
    return DEFAULT_AVATAR_URL;
  }
}

export function setDashboardAvatar(src: string) {
  try {
    const value = src.trim();
    if (!value || value === DEFAULT_AVATAR_URL) {
      localStorage.removeItem(AVATAR_KEY);
    } else {
      localStorage.setItem(AVATAR_KEY, value);
    }
  } catch {
    /* storage full or unavailable — header just won't persist */
  }
  window.dispatchEvent(new Event(AVATAR_EVENT));
}

export function resetDashboardAvatar() {
  setDashboardAvatar("");
}

export function isDefaultAvatar(src: string) {
  return src === DEFAULT_AVATAR_URL;
}

/** Subscribe to avatar changes (returns unsubscribe). */
export function onDashboardAvatarChange(listener: () => void): () => void {
  window.addEventListener(AVATAR_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(AVATAR_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
