export function getMediaThumbnail(url?: string | null) {
  if (!url) return "/placeholder.png";

  const isVideo = url.includes("/video/upload/");

  if (!isVideo) return url;

  return url
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.(mp4|webm|mov)$/i, ".jpg");
}
