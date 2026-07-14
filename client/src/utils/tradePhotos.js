const PHOTO_BASE = "https://images.unsplash.com/";
const PARAMS = "?auto=format&fit=crop&w=500&q=75";

// Verified, free-to-use Unsplash photos, keyed by trade. Used as a fallback
// when a worker hasn't uploaded their own portfolio photos yet, so cards
// always look photo-rich instead of falling back to a blank initial avatar.
export const TRADE_PHOTO = {
  Electrician: `${PHOTO_BASE}photo-1621905251189-08b45d6a269e${PARAMS}`,
  Plumber: `${PHOTO_BASE}photo-1749532125405-70950966b0e5${PARAMS}`,
  Tailor: `${PHOTO_BASE}photo-1752946253686-a15088ab0b8f${PARAMS}`,
  Carpenter: `${PHOTO_BASE}photo-1687422810663-c316494f725a${PARAMS}`,
  Welder: `${PHOTO_BASE}photo-1466779561253-0a08336ba2ab${PARAMS}`,
};

export function getTradePhoto(trade) {
  return TRADE_PHOTO[trade] || null;
}
