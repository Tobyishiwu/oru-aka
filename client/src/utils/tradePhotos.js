// A worker's real uploaded photos always take priority. This intentionally
// has no stock-photo fallback: hotlinked stock images are unreliable (they
// can 404 or vanish) and misleading (a real stranger's photo attached to a
// fictional or unverified profile). A clean icon/initials placeholder is a
// more honest default until a worker uploads their own real photo.
export function getTradePhoto() {
  return null;
}
