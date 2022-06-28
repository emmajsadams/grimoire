import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

export function formatTimeAgo(date: string): string {
  if (!date) {
    return "";
  }

  const timeAgo = new TimeAgo("en-US");

  // TODO: Fix the typing here should always be a stirng
  return timeAgo.format(new Date(date)) as any;
}
