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