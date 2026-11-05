export function formatDateSeparator(dateString) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(dateString);

  // Compare year, month, and day to see if the date is today.
  const isToday = today.getFullYear() === inputDate.getFullYear() &&
                  today.getMonth() === inputDate.getMonth() &&
                  today.getDate() === inputDate.getDate();

  if (isToday) {
    return "Today";
  }

  // Compare year, month, and day to see if the date is yesterday.
  const isYesterday = yesterday.getFullYear() === inputDate.getFullYear() &&
                      yesterday.getMonth() === inputDate.getMonth() &&
                      yesterday.getDate() === inputDate.getDate();

  if (isYesterday) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(inputDate);
}
const THUMBNAIL_SIZE = 128;
const VIDEO_THUMBNAIL_TIMEOUT = 5000;

// Draws a small JPEG preview of an image or video. It goes inside the encrypted attachment manifest,
// so chats can show thumbnails without downloading the attachment. Returns null if the browser can't decode the file.
export async function createAttachmentThumbnail(file) {
  try {
    if (file.type.startsWith("image/")) {
      const bitmap = await createImageBitmap(file);
      const thumbnail = drawThumbnail(bitmap, bitmap.width, bitmap.height);
      bitmap.close();
      return thumbnail;
    }
    if (file.type.startsWith("video/")) {
      return await createVideoThumbnail(file);
    }
  } catch (error) {
    // No thumbnail; the chat falls back to an icon
  }
  return null;
}

function drawThumbnail(source, width, height) {
  const scale = Math.min(1, THUMBNAIL_SIZE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

function createVideoThumbnail(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let done = false;
    const finish = (thumbnail) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve(thumbnail);
    };
    const timeout = setTimeout(() => finish(null), VIDEO_THUMBNAIL_TIMEOUT);

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // Skip ahead a little, since the very first frame is often black
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(0.5, (video.duration || 0) / 2);
    });
    video.addEventListener("seeked", () => finish(drawThumbnail(video, video.videoWidth, video.videoHeight)));
    video.addEventListener("error", () => finish(null));
    video.src = url;
  });
}

// The reactions pill is updated for everyone through a turbo stream broadcast
export function sendReaction(url, chatId, reaction) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ message_interaction: { chat_id: chatId, reaction: reaction } })
  });
}
