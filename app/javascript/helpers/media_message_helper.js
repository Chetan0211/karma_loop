// GIF and sticker messages are sent as a small JSON payload inside the encrypted message,
// so the server can't tell them apart from text messages.
const MEDIA_KEY = "kl_media";
const MEDIA_TYPES = ["gif", "sticker"];
const MEDIA_LABELS = { gif: "GIF", sticker: "Sticker" };

export function buildMediaMessage(type, item) {
  return JSON.stringify({
    [MEDIA_KEY]: { type: type, id: item.id, url: item.url, width: item.width, height: item.height, title: item.title }
  });
}

// Returns the media details, or null for an ordinary text message.
// The payload comes from another user, so only accept https URLs on Giphy's CDN,
// otherwise a crafted message could make everyone in the chat load a tracking URL.
export function parseMediaMessage(text) {
  if (typeof text != "string" || !text.startsWith(`{"${MEDIA_KEY}"`)) return null;
  try {
    const media = JSON.parse(text)[MEDIA_KEY];
    if (!media || !MEDIA_TYPES.includes(media.type) || !isGiphyUrl(media.url)) return null;
    return {
      type: media.type,
      url: media.url,
      width: Number(media.width) || 200,
      height: Number(media.height) || 200,
      title: String(media.title || MEDIA_LABELS[media.type])
    };
  } catch (error) {
    return null;
  }
}

// Short text for places that only show a line of text, like the chat list and notifications
export function messagePreviewText(text) {
  const media = parseMediaMessage(text);
  return media ? MEDIA_LABELS[media.type] : text;
}

// size: "full" for the message itself, "small" for reply previews
export function createMediaElement(media, size = "full") {
  const image = document.createElement("img");
  image.src = media.url;
  image.alt = media.title;
  image.loading = "lazy";
  image.dataset.media = media.type;
  // width and height reserve the space before the GIF loads, so the chat doesn't jump
  image.width = media.width;
  image.height = media.height;
  image.className = "block rounded-lg";
  image.style.maxWidth = "100%";
  image.style.height = "auto";
  if (size == "small") {
    image.style.height = "3rem";
    image.style.width = "auto";
  }
  return image;
}

function isGiphyUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol == "https:" && /^(media\d*|i)\.giphy\.com$/.test(parsed.hostname);
  } catch (error) {
    return false;
  }
}
